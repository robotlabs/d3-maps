var webpack = require('webpack');
var config = require('./config');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var BrowserSyncPlugin = require('browser-sync-webpack-plugin');
var utils = require('./utils.js');

module.exports = function(env) {
  var serverProxy = '';
  if (env) {
    serverProxy = utils.parseServerProxy(env.serverproxy);
  }

  return {
    target: 'web',
    devtool: 'false',
    entry: config.entryProd,
    output: {
      path: __dirname + config.outputPath.exportJsPath,
      filename: '[name].js'
    },
    plugins: [
      new ExtractTextPlugin({
        filename: config.outputPath.cssPath + '[name].css',
        allChunks: true
      }),
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
      new BrowserSyncPlugin(
        {
          host: 'localhost',
          port: 3011,
          proxy: serverProxy
        },
        {
          reload: true
        }
      ),
      new webpack.optimize.UglifyJsPlugin({
        minimize: true,
        compress: {
          warnings: false
        },
        sourceMap: true
      }),
      new webpack.DefinePlugin({
        'process.env': {
          'NODE_ENV': JSON.stringify('production')
        }
      })
    ],
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: [/node_modules/, /vendor/, /support\/fixtures/],
          loader: 'babel-loader'
        },
        {
          test: /\.css$/,
          use: ExtractTextPlugin.extract([
            {
              loader: 'css-loader',
              options: {
                modules: true,
                importLoaders: 1,
                localIdentName: '[local]--[hash:base64:5]'
              }
            },
            'postcss-loader'
          ])
        }
      // {
      //   test: /\.css$/,
      //   loader: ExtractTextPlugin.extract('css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss-loader')
      // }
      ]}
  };
};
