var path = require('path');
var webpack = require('webpack');

var srcDir = path.join(__dirname, './src');
var publicDir = path.join(__dirname, './public');
var nodeModulesDir = path.join(__dirname, './node_modules');

var config = {
    production: process.env.NODE_ENV === 'production'
};

var plugins = [].concat(config.production ? [new webpack.DefinePlugin({'process.env': {'NODE_ENV': JSON.stringify('production')}}), new webpack.optimize.UglifyJsPlugin({compress: {warnings: false}})] : []);

var webpackConfig = {

    debug: config.production ? false : true,
    devtool: config.production ? 'cheap-module-source-map' : 'source-map',

    entry: srcDir+'/main.js',
    output: {
        path: publicDir,
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {
                loader: 'style!css',
                test: /\.css$/,
                include: [nodeModulesDir + '/bootstrap/dist/css/bootstrap.css', nodeModulesDir + '/bootstrap-material-design/dist/css/bootstrap-material-design.css', nodeModulesDir + '/bootstrap-material-design/dist/css/ripples.css']
            },
            {
                loader: 'style!css!less',
                test: /\.less$/,
                include: srcDir
            },
            {
                loader: 'url?limit=25000',
                test: /\.(jpg|png)$/,
                include: srcDir
            },

            // the url-loader uses DataUrls.
            // the file-loader emits files.
            {test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/font-woff'},
            {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/octet-stream'},
            {test: /\.(eot|otf)(\?v=\d+\.\d+\.\d+)?$/, loader: 'file'},
            {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=image/svg+xml'}
        ]
    },
    plugins: plugins
};

module.exports = webpackConfig;