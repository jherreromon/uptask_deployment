const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

//Lo primero hacer referencia al modelo a autenticar
const Usuarios = require('../models/Usuarios');

//local strategy - login con credenciales propias(usuario y password)
passport.use(
    new LocalStrategy(
        //por defecto passport espera un usuario y password
        //pero se puede redefinir de la ssgte manera:
        {
            usernameField: 'email',
            passportField: 'password'
        },
        //realizamos la consulta en la bbdd
        //done->es un callback similar a next()
        async(email, password, done) => {
            //puede ser que un usuario no exista. Con lo cual, hay q trabajar con
            //try-catch (en vez de con promise)
            try {
                const usuario = await Usuarios.findOne({
                    where: {
                        email,
                        activo: 1
                    }
                });

                //El usuario existe peeeero password incorrecto
                if (!usuario.verificarPassword(password)) {
                    return done(null, false, {
                        message: 'Password Incorrecto'
                    })
                }
                //el Email existe, y el Password correcto: null->error como parametro
                return done(null, usuario);


            } catch (error) {
                //ese usuario no existe done(error, usuario, { mensaje})
                return done(null, false, {
                    message: 'Esa cuenta no existe'
                })

            }


        }


    )

);

//serializar el usuario-> convertir valores a objeto
passport.serializeUser((usuario, callback) => {
    //null->error ninguno
    callback(null, usuario)

});



//deserializar el usuario-> obtener a los valores un objeto
passport.deserializeUser((usuario, callback) => {
    callback(null, usuario);
});

module.exports = passport;