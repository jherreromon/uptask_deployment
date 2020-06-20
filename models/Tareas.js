const Sequelize = require('sequelize');
const db = require('../config/db');
//importamos para relacionar
const Proyectos = require('./Proyectos');

const Tareas = db.define('tareas', {
    id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
    },
    tarea: Sequelize.STRING(100),
    estado: Sequelize.INTEGER(1)
});
//definición de clave foránea
Tareas.belongsTo(Proyectos);
//tb se puede hacer de la siguiente manera
//en el Modelo proyectos
//Proyectos.hasMany(Tareas);

module.exports = Tareas;