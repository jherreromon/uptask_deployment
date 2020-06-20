const Proyectos = require('../models/Proyectos');
const Tareas = require('../models/Tareas');

exports.agregarTarea = async(req, res, next) => {
    //findOne->Sequelize: sustituye a sent. SQL.
    const proyecto = await Proyectos.findOne({
        where: { url: req.params.url }
    });
    //leer el valor de la tarea que se mete en el formulario

    const { tarea } = req.body;
    //estado = 0 -> estado incompleto;
    const estado = 0;
    //recogemos el id, de la tabla Proyectos
    const proyectoId = proyecto.id;

    //insertar en la bbdd (tabla Tareas). 
    //el id no es necesario ya que es un campo autoIncrement

    const resultado = await Tareas.create({ tarea, estado, proyectoId });

    if (!resultado) {
        return next();
    }
    //redireccionar
    res.redirect(`/proyectos/${req.params.url}`);

}

exports.cambiarEstadoTarea = async(req, res) => {
    //cuando trabajas con Patch, no funciona req.query
    //hay q trabajar con req.params
    const { id } = req.params;
    const tarea = await Tareas.findOne({ where: { id: id } })
        //cambiar campo estado 

    let estado = 0;
    if (tarea.estado === estado) {
        estado = 1;
    }

    tarea.estado = estado;

    const resultado = await tarea.save();
    //si la conexion no se llevo a cabo
    if (!resultado) return next();


    res.status(200).send('actualizado');
}

exports.eliminarTarea = async(req, res) => {
    //tb se puede parar como req.query
    const { id } = req.params;
    //eliminar la tarea

    const resultado = await Tareas.destroy({ where: { id: id } });
    //si no hay resultado, se pasa a ssgte middleware
    if (!resultado) return next();

    res.status(200).send('Tarea Elmininada');
}