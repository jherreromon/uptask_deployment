//esta sintaxis (moderna)  NO la soporta express
//import express from express;

//este código es el que soporta express es igual que el anterior
const express = require('express');
const routes = require('./routes');
//path existe en node
const path = require('path');
//libreria de express q permite leer lo q se
//manda x el formulario en el servidor (objeto body)
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
//sirve para validar en el servidor una direccion 
//de correo, entre otras validaciones
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');
//importar las variables locales
require('dotenv').config({ path: 'variables.env' });


//helpers con algunas funciones
const helpers = require('./helpers');


//acceso a conexion con sequalize
const db = require('./config/db');

//Importar el modelo
require('./models/Proyectos');
require('./models/Tareas');
require('./models/Usuarios');

//creamos el modelo de datos en MySql con "db.sync()"
//devuelve un promise: por eso trabajamos con then
db.sync()
    .then(() => console.log('C0nectad0 al sevird0r'))
    .catch((error) => console.log(error));

//esta variable (app) contiene todo lo necesario para 
//trabajar con express
const app = express();

//Donde cargar los archivos estáticos
app.use(express.static('public'));

//habilitar pug
app.set('view engine', 'pug');

//para leer los datos del formulario q se envian en request (req)
//hay q habilitar body.parser
app.use(bodyParser.urlencoded({ extended: true }));

app.use(expressValidator());


//añadir las carpetas de las vistas
app.set('views', path.join(__dirname, './views'));

//agregar flash messages
app.use(flash());

app.use(cookieParser());

//libreria de cookies. Nos permite navegar entre distintas paginas sin volvernos a autentificar
//tb, nos permite trabajar con req.session
app.use(session({
    secret: 'supersecreto',
    //sirve para decidir si queremos q se mantenga la 
    //sesion viva aunque no se haga nada (tiempo de desconexion)
    resave: false,
    saveUninitialized: false
}));

//permite arrancar una instancia d passport
app.use(passport.initialize());
//es importante q esté después de sessión
//para q el usuario vaya de pagina en pagina
app.use(passport.session());



//pasar del helpers vardump a la aplicacion
//res.locals->lo q hace es crear variables internas 
//y permite consumirlas internamente
//a este código se conoce como middleware
app.use((req, res, next) => {
    //req.user->informacion del usuario logeado
    //console.log(req.user);
    res.locals.vardump = helpers.vardump;
    res.locals.mensajes = req.flash();
    res.locals.usuario = {...req.user } || null;

    next();

});



//ruta para el home
//cuando ponemos .use-> lee todo. tanto GET, POST, PUT.....
app.use('/', routes());

//definimos las rutas con los middleware->
//->funciones q se ejecutan unos tras otros


//usamos un puerto no usado para ejecutar express;
//app.listen(3000);

//              local             heroku
const host = process.env.HOST || '0.0.0.0';
//              //heroku         Localhost
const port = process.env.PORT || 3000;

app.listen(port, host, () => {
    console.log('el servidor esta funcionando');
});

//se utiliza para probar que funciona mandar correo para el 
//reset de la password
//require('./handlers/email');