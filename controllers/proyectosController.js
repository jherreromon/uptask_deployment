const Proyectos = require('../models/Proyectos');
const Tareas = require('../models/Tareas');

//const slug = require('slug');

//exports, cuando se exporta varias partes del codigo
//mdoules.exports, cuando se exporta una sola parte de codigo desde un fichero
exports.proyectosHome = async(req, res) => {
    //sentencia sequalize
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({ where: { usuarioId: usuarioId } });

    res.render('index', {
        nombrePagina: 'Proyectos',
        proyectos
    });
}

exports.formularioProyecto = async(req, res) => {
    //sentencia sequalize
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({ where: { usuarioId: usuarioId } });

    res.render('nuevoProyecto', {
        nombrePagina: "Nuevo Proyecto",
        proyectos

    })
}

exports.nuevoProyecto = async(req, res) => {
    //sentencia sequalize
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({ where: { usuarioId: usuarioId } });

    //enviar a la consola lo q el usuario escriba
    //console.log(req.body);

    //validar que tengamos algo en el input del formulario
    //extraemos nombre con "destructuring"
    const { nombre } = req.body;

    let errores = [];

    if (!nombre) {
        errores.push({ texto: 'agrega un nombre al proyecto' })
    }

    //si hay errores

    if (errores.length > 0) {
        res.render('nuevoProyecto', {
            nombrePagina: 'Nuevo Proyecto',
            errores,
            proyectos
        })
    } else {
        //Paquete slug->permite transformar texto
        //en nuestro caso, sirve para transformar nombre en una url
        //const url = slug(nombre).toLowerCase();
        //si no hay errores insertamos en bbdd
        //create->propiedad de Sequalize
        /* Proyectos.create({ nombre })
            .then(() => console.log('insertado Correctamente'))
            .catch((error) => console.log(error)); */
        //la alternativa al then-catch anterior (promesa)
        const usuarioId = res.locals.usuario.id;
        await Proyectos.create({ nombre, usuarioId });
        res.redirect('/');
    }
}
exports.proyectoPorUrl = async(req, res, next) => {
    //sentencia sequalize
    const usuarioId = res.locals.usuario.id;
    const proyectosPromise = Proyectos.findAll({ where: { usuarioId: usuarioId } });

    //emula a un where de sql x sequalize
    const proyectoPromise = Proyectos.findOne({
        where: {
            url: req.params.url,
            usuarioId: usuarioId
        }
    });
    const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise]);

    //************Consultar tareas del Proyecto actual********
    const tareas = await Tareas.findAll({
        where: {
            proyectoId: proyecto.id
        }
        //si lo necesitaramos, incluiriamos la base de datos relacionada. 
        /*  include: [
             { model: Proyectos }
         ] */
    });

    //**********************************************************


    // si no hay nada, sigue con el siguiente middleware
    if (!proyecto) return next();

    //render a la vista->para
    res.render('tareas', {
        nombrePagina: 'Tareas del Proyecto',
        proyecto,
        proyectos,
        tareas
    })
}
exports.formularioEditar = async(req, res) => {
    //sentencia sequalize
    const usuarioId = res.locals.usuario.id;
    const proyectosPromise = Proyectos.findAll({ where: { usuarioId: usuarioId } });

    const proyectoPromise = Proyectos.findOne({
        where: {
            id: req.params.id,
            usuarioId: usuarioId
        }
    });
    //en vez de poner dos await consecutidos en:
    //  - await Proyectos.findAll()
    //  -await Proyectos.findOne()
    // gestionamos un promise.all
    const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise]);

    //acceder al render: fichero .pug
    res.render('nuevoproyecto', {
        nombrePagina: 'Editar Proyecto',
        proyectos,
        proyecto
    });

}

exports.actualizarProyecto = async(req, res) => {
        //sentencia sequalize
        const usuarioId = res.locals.usuario.id;
        const proyectos = await Proyectos.findAll({ where: { usuarioId: usuarioId } });

        //enviar a la consola lo q el usuario escriba
        //console.log(req.body);

        //validar que tengamos algo en el input del formulario
        //extraemos nombre con "destructuring"
        const { nombre } = req.body;

        let errores = [];

        if (!nombre) {
            errores.push({ texto: 'agrega un nombre al proyecto' })
        }

        //si hay errores

        if (errores.length > 0) {
            res.render('nuevoProyecto', {
                nombrePagina: 'Nuevo Proyecto',
                errores,
                proyectos
            })
        } else {
            //Paquete slug->permite transformar texto
            //en nuestro caso, sirve para transformar nombre en una url
            //const url = slug(nombre).toLowerCase();
            //si no hay errores insertamos en bbdd
            //update->propiedad de Sequalize
            /* Proyectos.update({ nombre })
                .then(() => console.log('insertado Correctamente'))
                .catch((error) => console.log(error)); */
            //la alternativa al then-catch anterior (promesa)
            await Proyectos.update({ nombre: nombre }, { where: { id: req.params.id } });
            res.redirect('/');
        }
    }
    //recapitulando:
    //->desde el cliente, se ejecuta axios.delete
    //->en backend: routes.index.js->app

exports.eliminarProyecto = async(req, res, next) => {
    //req->información q nos manda desde el cliente
    //podemos usuar req.params q devuelve -> { url: 'tienda-virtual-en-woocommerce' }
    //o podemos usar req.query q devuelve -> { urlProyecto: 'tienda-virtual-en-woocommerce' }
    //urlProyecto, es la variable q pasamos con axios.delete(url, { params: { urlProyecto } })
    //q a su vez, pilla del parametro html5->data-proyecto-url=proyecto.url
    // console.log(req.query);
    const { urlProyecto } = req.query;
    //pasamos sequalize
    const resultado = await Proyectos.destroy({ where: { url: urlProyecto } });
    //si hay un error
    if (!resultado) {
        return next();
    }
    res.status(200).send('proyecto eliminado correctamente');
}