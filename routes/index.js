const express = require('express');
const router = express.Router();

//importar express validator
//y la función check q permite revisar
//lo q queremos hacer

//const { body } = require('express-validator/check');->deprecated
const { body } = require("express-validator/check");

//importamos el controlador
const proyectosController = require('../controllers/proyectosController')
const tareasController = require('../controllers/tareasController');
const usuariosController = require('../controllers/usuariosController');
const authController = require('../controllers/authController');

//module.exports = export default 
//module.exports->solo se puede tener uno en el fichero.
module.exports = function() {

    router.get('/',
        authController.usuarioAutenticado,
        //si el usuario esta autenticado pasaría a est middleware ya q hay en next() en  authController.usuarioAutenticado 
        proyectosController.proyectosHome

    );
    router.get('/nuevo-proyecto',
        authController.usuarioAutenticado,
        proyectosController.formularioProyecto

    );
    //es el mismo que el get, solo que este va a reaccionar a POST
    //despues del get, se ejecuta el post automaticamente.
    router.post('/nuevo-proyecto',
        authController.usuarioAutenticado,
        body('nombre').not().isEmpty().trim().escape(),
        proyectosController.nuevoProyecto
    );

    //listar Proyecto
    router.get('/proyectos/:url',
        authController.usuarioAutenticado,
        proyectosController.proyectoPorUrl
    );

    //actualizar el proyecto 
    router.get('/proyecto/editar/:id',
        authController.usuarioAutenticado,
        proyectosController.formularioEditar
    );

    router.post('/nuevo-proyecto/:id',
        authController.usuarioAutenticado,
        body('nombre').not().isEmpty().trim().escape(),
        proyectosController.actualizarProyecto
    );

    //eliminar Proyecto(ponemos el delete q se utiliza el axios)
    router.delete('/proyectos/:url',
        authController.usuarioAutenticado,
        proyectosController.eliminarProyecto
    );

    //router para las tareas
    router.post('/proyectos/:url',
        authController.usuarioAutenticado,
        tareasController.agregarTarea
    );

    //Actualizar Tarea(es muy similiar a Update)
    //put se utilizar para cambiar todo un registro
    //patch, para actualizar únicamente un campo

    router.patch('/tareas/:id',
        authController.usuarioAutenticado,
        tareasController.cambiarEstadoTarea
    );

    //eliminar tarea: Se conecta con el axios.delete desde el cliente
    router.delete('/tareas/:id',
        authController.usuarioAutenticado,
        tareasController.eliminarTarea
    );

    //Crear nueva cuenta usuario
    //OJO!!! con el get, SOLO visualizamos el formulario

    router.get('/crear-cuenta', usuariosController.formCrearCuenta);

    //cuando se rellene formulario de usuario,
    //hay q mandar los datos al servidor. Para ello, trabajaremos con AXIOS

    router.post('/crear-cuenta', usuariosController.crearCuenta);
    router.get('/confirmar/:correo', usuariosController.confirmarCuenta);

    //iniciar sesión
    router.get('/iniciar-sesion', usuariosController.formIniciarSesion);
    //gestiona q el usuario sea correcto. utiliza passport en-> authController.autenticarUsuario
    router.post('/iniciar-sesion', authController.autenticarUsuario);

    //cerrar sesion
    router.get('/cerrar-sesion', authController.cerrarSesion);

    //reestablecer contraseña
    router.get('/reestablecer', usuariosController.formRestablecerPassword);
    router.post('/reestablecer', authController.enviarToken);

    router.get('/reestablecer/:token', authController.validarToken);
    router.post('/reestablecer/:token', authController.actualizarPassword);
    //retorna router al /index.js
    return router;
}