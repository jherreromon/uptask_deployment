const path = require('path');
const webpack = require('webpack');

module.exports = {
    //punto de entrada: fichero q se va a pasar x webpack y babbel
    entry: './public/js/app.js',
    output: {
        filename: 'bundle.js',
        //webpack crea una carpeta en public:->dist
        path: path.join(__dirname, './public/dist')
    },
    //webpack requiere de modulos a tratar: en este caso
    //trabajamos con babel
    module: {
        rules: [{
                //test->q archivos va a utilizar:busca archivos js
                test: /\.m?js$/,
                //use-> le decimos quien los va a tratar:babel
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }

        ]
    }
}