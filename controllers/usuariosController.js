const Usuarios = require('../models/Usuarios');
const enviarEmail = require('../handlers/email');


exports.formCrearCuenta = (req, res) => {
    res.render('crearCuenta', {
        nombrePagina: 'Crear Cuenta en Uptask'
    })
}

exports.formIniciarSesion = (req, res) => {
    const { error } = res.locals.mensajes;
    res.render('iniciarSesion', {
        nombrePagina: 'Iniciar Sesión en  Uptask',
        error: error
    })
}

exports.crearCuenta = async(req, res) => {
    //leer los datos desde el formulario
    const { email, password } = req.body;

    //cuando pueda haber un usuario duplicado, es mejor usar try-catch
    //para poderle renderizar en el html
    try {
        await Usuarios.create({
            email,
            password
        });

        //crear una URL de confirmar
        const confirmarUrl = `http://${req.headers.host}/confirmar/${email}`;

        //crear el objeto usuario con la propiedad email
        const usuario = {
            email
        };

        //enviar email
        await enviarEmail.enviar({
            usuario,
            subject: 'Confirma tu cuenta en UpTask',
            confirmarUrl,
            //archivo pug al que pasamos los parámetros
            archivo: 'confirmar-cuenta'

        });

        //redirigir al usuario
        req.flash('correcto', 'Enviamos un correo, confirma tu cuenta');
        res.redirect('/iniciar-sesion');
    } catch (error) {
        //error.errors-> errors es un arreglo de errores q es gestor de errores de sequelize
        req.flash('error', error.errors.map(error => error.message));
        res.render('crearCuenta', {

            mensajes: req.flash(),
            nombrePagina: 'Crear Cuenta en Uptask',
            //pasamos el email y password para q no se borren si hay error 
            //y no tener q rellenar todo de nuevo
            email,
            password

        })

    }
}

exports.formRestablecerPassword = (req, res) => {
    res.render('reestablecer', {
        nombrePagina: 'Reestablecer tu contraseña'
    })
}

//cambiar el estado de una cuenta
exports.confirmarCuenta = async(req, res) => {
    const usuario = await Usuarios.findOne({
        where: {
            email: req.params.correo
        }
    })

    //si no existe el usuario
    if (!usuario) {
        req.flash('error', 'No valido');
        res.redirect('crear-cuenta');
    }

    usuario.activo = 1;
    await usuario.save();

    req.flash('correcto', 'cuenta activada correctamente');
    res.redirect('/iniciar-sesion');
}

//Crear el usuario en la bbdd
//se queda "dando vueltas el navegador" ya que no usamos async/await
//en este caso usamos con sequelize, promises(then)