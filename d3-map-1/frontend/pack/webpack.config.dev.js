var config = require('./config');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var BrowserSyncPlugin = require('browser-sync-webpack-plugin');
var webpack = require('webpack');
var utils = require('./utils.js');
var path = require('path');

module.exports = function(env) {
  return {
    target: 'web',
    devtool: 'cheap-module-eval-source-map',//'cheap-module-source-map',
    entry: config.entryDev,
    output: {
      path: __dirname + config.outputPath.exportJsPath,
      filename: '[name].js'
    },
    plugins: [
      new ExtractTextPlugin({
        filename: config.outputPath.cssPath + '[name].css',
        allChunks: true
      }),
      new BrowserSyncPlugin({
        host: 'localhost',
        //port: 3011,
        // port: 3011,
        proxy: 'http://localhost:8000/'
      },
        {
          reload: true
        }
      ),
      new webpack.LoaderOptionsPlugin({
        options: {
          context: __dirname,
          postcss: [
            require('precss'),
            require('autoprefixer'),
            require('postcss-modules-values')
          ]
        }
      }),
      new webpack.DefinePlugin({
        'process.env': {
          'NODE_ENV': JSON.stringify('development'),
          'API_URL': JSON.stringify('http://10.10.10.10:8080/bands')
        }
      })
    ],
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: [/node_modules/, /vendor/, /support\/fixtures/],
          loader: 'babel-loader',
          query: {compact: false}
        },
        {
          test: /\.css$/,
          use: ExtractTextPlugin.extract([
            {
              loader: 'css-loader',
              options: {
                modules: true,
                importLoaders: 1,
                localIdentName: '[local]-[hash:base64:5]'
              }
            },
            'postcss-loader'
          ])
        }
      ]
    }
  };
};
