//definimos el modelo
const Sequelize = require('sequelize');
const slug = require('slug');
const shortid = require('shortid');


const db = require('../config/db');

//definimos el modelo
const Proyectos = db.define('proyectos', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    nombre: Sequelize.STRING,
    url: Sequelize.STRING

}, {
    hooks: {
        //hooks hace d controlador de eventos
        //slug, nos permite trabajar con los datos
        beforeCreate(proyecto) {
            const url = slug(proyecto.nombre).toLowerCase();
            //shortid (libreria) permite generar registros unicos con postfijo aleatorio
            proyecto.url = `${url}-${shortid.generate()}`;
        }
    }
});

module.exports = Proyectos;