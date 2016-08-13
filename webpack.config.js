var path = require('path');
var webpack = require('webpack');

var bundleDir = path.join(__dirname, './output');
var imagesDir = path.join(__dirname, './images');
var nodeModulesDir = path.join(__dirname, './node_modules');

var config = {
    production: process.env.NODE_ENV === 'production'
};

var plugins = [].concat(config.production ? [new webpack.DefinePlugin({'process.env': {'NODE_ENV': JSON.stringify('production')}}), new webpack.optimize.UglifyJsPlugin({compress: {unused: false, drop_console: true, warnings: false}})] : []);

var webpackConfig = {

    debug: config.production ? false : true,
    devtool: config.production ? undefined : 'source-map',

    entry: __dirname + '/main.js',
    output: {
        path: bundleDir,
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {
                loader: 'style!css',
                test: /\.css$/,
                include: [
                    nodeModulesDir + '/bootstrap/dist/css/bootstrap.css',
                    nodeModulesDir + '/bootstrap-material-design/dist/css/bootstrap-material-design.css',
                    nodeModulesDir + '/bootstrap-material-design/dist/css/ripples.css',
                    nodeModulesDir + '/font-awesome/css/font-awesome.css'
                ]
            },
            {
                loader: 'style!css!less',
                test: /\.less$/,
                include: __dirname + '/style.less'
            },

            {
                loader: 'url?limit=10000000&name=images/background/[name].[ext]',
                test: /\.(jpg|png)$/,
                include: imagesDir + '/background'
            },
            {
                loader: 'url?limit=10000000&name=images/portfolio/[name].[ext]',
                test: /\.(jpg|png)$/,
                include: imagesDir + '/portfolio'
            },

            // Loaders for bootstrap and font-awesome fonts
            {test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=1000000&mimetype=application/font-woff&name=fonts/[name].[ext]'},
            {test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=1000000&mimetype=application/font-woff2&name=fonts/[name].[ext]'},
            {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=1000000&mimetype=application/octet-stream&name=fonts/[name].[ext]'},
            {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=1000000&mimetype=application/vnd.ms-fontobject&name=fonts/[name].[ext]'},
            {test: /\.otf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=1000000&mimetype=application/vnd.ms-fontobject&name=fonts/[name].[ext]'},
            {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=1000000&mimetype=image/svg+xml&name=fonts/[name].[ext]'}
        ]
    },
    plugins: plugins
};

module.exports = webpackConfig;