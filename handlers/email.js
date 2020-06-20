const nodemailer = require('nodemailer');
//vamos a utilizar una plantilla
const pug = require('pug');
//permite trabajar estilos lineales
const juice = require('juice');
//permite trabajar de html a texto
const htmlToText = require('html-to-text');
//utilidad agregada en node (a partir de node 8)
//permite q funciones que no soportan async/await, lo soporten
const util = require('util');
//fichero de configuracion
const emailConfig = require('../config/email');

//node, manda los correos creando lo q se denomina un transport
//*********configurar el correo para mandar ****** */
let transport = nodemailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.port,
    auth: {
        user: emailConfig.user, // generated ethereal user
        pass: emailConfig.pass
    }

});

//generar HTML
const generarHTML = (archivo, opciones = {}) => {
        //método de pug para importar fichero: 
        //__dirname->ubicación en la q estamos
        //../->subir un nivel
        //en opciones, va resetUrl.
        const html = pug.renderFile(`${__dirname}/../views/emails/${ archivo }.pug`, opciones);
        //juice->permite q el html y CSS se codifiquen en nodemail
        return juice(html);


    }
    //********funcion que se llama desde ficheros externos para enviar el correo

exports.enviar = async(opciones) => {
    ////////configurar las opciones para mandar el correo
    const html = generarHTML(opciones.archivo, opciones);
    const text = htmlToText.fromString(html);
    let opcionesEmail = {
        from: 'Uptask <noreply@uptask.com', // sender address
        to: opciones.usuario.email, // list of receivers
        subject: opciones.subject, // Subject line
        text, // plain text body
        html
    };

    ///***********+mandar el correo ******** */
    const enviarEmail = util.promisify(transport.sendMail, transport);
    return enviarEmail.call(transport, opcionesEmail);

    //esta función no permite async/await
    //por eso hay q utilizar con utils.promisify
    //tranport.sendMail(opcionesEmail);
}