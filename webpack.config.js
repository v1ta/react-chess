var webpack = require('webpack'),
    copyWebpackPlugin = require('copy-webpack-plugin'),
    path = require('path'),
    BUILD_DIR = path.resolve(__dirname, 'public'),
    APP_DIR = path.resolve(__dirname, 'src/js'),
    STYLE_DIR = path.resolve(__dirname, 'src/scss'),
    ASSET_DIR = path.resolve(__dirname, 'src/assets'),
    config = {
        entry: APP_DIR + '/index.js',
        output: {
            path: BUILD_DIR,
            filename: 'bundle.js'
        },
        plugins: [
            new copyWebpackPlugin([
                {from: ASSET_DIR, to: BUILD_DIR + '/assets'}
            ])
        ],
        module: {
            loaders: [
                {
                    test: /.js/,
                    include: APP_DIR,
                    loader: 'babel',
                    exclude: /node_modules/
                },
                {
                    test: /\.scss/,
                    include: STYLE_DIR,
                    loader: 'style-loader!css-loader!sass-loader'
                },
                {
                    test: /\.(jpe?g|png|gif|svg)$/i,
                    include: ASSET_DIR,
                    loaders: [
                        'file?hash=sha512&digest=hex&name=[hash].[ext]',
                        'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
                    ]
                }
            ]
        }
    };

module.exports = config;