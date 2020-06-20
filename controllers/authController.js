const passport = require('passport');
const Usuarios = require('../models/Usuarios');
//sirve para hacer operaciones de comparación con sequelize
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
//utilidad q viene con node para generar TOKENS.
const crypto = require('crypto');
const bcrypt = require('bcrypt-nodejs');
const enviarEmail = require('../handlers/email');
//local-> xq es un usuario nuestro
//si fuera para facebook, cambiariamos a facebook
//sucessRedirect->autentificacion exitosa
//failureRedirect->error de autentificación
exports.autenticarUsuario = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/iniciar-sesion',
    //para trabajar con flash-connect
    failureFlash: true,
    //si no ponemos correo ni password
    badRequestMessage: 'Ambos Campos son obligatorios'

});

//funcion para revisar si el usuario esta logeado o no 

exports.usuarioAutenticado = (req, res, next) => {

        //si el usuario esta autenticado , adelante->función de passport
        if (req.isAuthenticated()) {
            return next();
        }

        //sino está autenticado, redirigir al formulario
        return res.redirect('/iniciar-sesion');
    }
    //funcion para cerrar sesion utiliza los objetos de session
exports.cerrarSesion = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/iniciar-sesion'); //al cerrar sesion al login
    })
}

//genera un token si el usuario es válido cuando se olvide de la contraseña
exports.enviarToken = async(req, res) => {
    //1º-Verificar que el usuario existe
    const { email } = req.body
    const usuario = await Usuarios.findOne({ where: { email: email } });

    //Si no existe el usuario
    if (!usuario) {
        //añadimos a flash el mensaje de error para pasarlo a render
        req.flash('error', 'No existe esa cuenta');
        res.redirect('/reestablecer');
    }
    //usuario existe:utilizamos token con crypto
    usuario.token = crypto.randomBytes(20).toString('hex');
    //expiracion: 1 hora
    usuario.expiracion = Date.now() + 3600000;

    //guardarlos en la base de datos. OJO!!! lo guardamos con save no con UPDATE
    //ya q estamos en el registro con el q trabajamos
    await usuario.save();

    //url de reset
    const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`;
    // console.log(resetUrl);

    //envia correo con el token
    await enviarEmail.enviar({
        usuario,
        subject: 'Password Reset',
        resetUrl,
        //archivo pug al que pasamos los parámetros
        archivo: 'reestablecer-password'

    });
    //terminar
    req.flash('correcto', 'se envio un mensaje a tu correo');
    res.redirect('/iniciar-sesion');

}

exports.validarToken = async(req, res) => {
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token
        }
    });

    //si no encuentr el usuario generamos mensaje de error
    if (!usuario) {
        req.flash('error', 'No valido');
        res.redirect('/reestablecer');
    }
    // console.log(usuario);

    //formulario para usuario valido
    res.render('resetPassword', {
        nombrePagina: 'restablecer contraseña'
    })

}

//cambia el password x uno nuevo (se manda desde un formulario)
//verifica el token valido y la fecha expiración (<= de una hora)
exports.actualizarPassword = async(req, res) => {
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token,
            expiracion: {
                //ver operaciones con sequelize:verifica la fecha de expiración
                //[Op.gte]-> expiracion >= Date.now()
                [Op.gte]: Date.now()
            }

        }
    });

    //verificamos usuario (token y fecha de expiracion)
    if (!usuario) {
        req.flash('error', 'No válido');
        //volvemos a pedir contraseña
        res.redirect('/reestablecer');
    }

    //si todo va bien, hasheamos el nuevo password y lo guardamos en bbdd
    usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    usuario.token = null;
    usuario.expiracion = null;
    //usuario.password = req.body.password;
    // console.log(usuario.password);


    await usuario.save();

    req.flash('correcto', 'tu password se ha modificado correctamente');
    res.redirect('/iniciar-sesion');



}