var webpack = require('webpack'),
    path = require('path'),
    BUILD_DIR = path.resolve(__dirname, 'src/js'),
    APP_DIR = path.resolve(__dirname, 'dev/js'),
    STYLE_DIR = path.resolve(__dirname, 'dev/css'),
    ASSET_DIR = path.resolve(__dirname, 'dev/assets'),
    config = {
        devServer: {
            inline: true,
            contentBase: './src',
            port: 3000
        },
        devtool: 'cheap-module-eval-source-map',
        entry: APP_DIR + '/index.js',
        output: {
            path: BUILD_DIR,
            filename: 'bundle.min.js'
        },
        module: {
            loaders: [
                {
                    test: /.js/,
                    incldue: APP_DIR,
                    loader: 'babel',
                    exclude: /node_modules/
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
        },
        plugins: [
            new webpack.optimize.OccurrenceOrderPlugin()
        ]
    };

module.exports = config;