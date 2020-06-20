//conectar base de datos con Sequelize.
const Sequelize = require('sequelize');
require('dotenv').config({ path: 'variables.env' });
//habilitamos la conexión Sequelize con dotenv(VARIABLES DE ENTORNO)
const db = new Sequelize(
    process.env.BD_NOMBRE,
    process.env.BD_USER,
    process.env.BD_PASS, {
        host: process.env.BD_HOST,
        dialect: 'mysql',
        port: process.env.BD_PORT,
        //operatorsAliases: false,
        define: {
            timestamps: false
        },

        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },

    });
//ojo exportamos el objeto db
module.exports = db;