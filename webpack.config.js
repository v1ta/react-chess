var webpack = require('webpack'),
    path = require('path'),
    BUILD_DIR = path.resolve(__dirname, 'src/client/public'),
    APP_DIR = path.resolve(__dirname, 'src/client/app'),
    STYLE_DIR = path.resolve(__dirname, 'src/client/css'),
    ASSET_DIR = path.resolve(__dirname, 'src/client/assets'),
    config = {
        entry: APP_DIR + '/index.js',
        output: {
            path: BUILD_DIR,
            filename: 'bundle.js'
        }, 
        module: {
            loaders: [
                {
                    test: /.js/,
                    incldue: APP_DIR,
                    loader: 'babel'
                },
                {
                    test: /\.css/,
                    include: STYLE_DIR,
                    loaders: ['css']
                },
                {
                    test: /\.(jpe?g|png|gif|svg)$/i,
                    incldue: ASSET_DIR,
                    loaders: [
                        'file?hash=sha512&digest=hex&name=[hash].[ext]',
                        'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
                    ]
                }
            ]
        }
    };

module.exports = config;