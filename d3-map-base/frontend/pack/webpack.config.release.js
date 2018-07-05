var webpack = require("webpack");
var config = require('./config');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  devtool: false,
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
      minimize: true,
      options: {
        context: __dirname,
        postcss: [
          require('precss'),
          require('autoprefixer'),
          require('postcss-modules-values')
        ]
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      mangle: true,
      compress: {
        warnings: false,
        drop_console: true
      },
      output: {
        comments: false
      }
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    })
  ],
  module: {
    rules: [{
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
            localIdentName: '[path][name]__[local]--[hash:base64:5]'
          }
        },
        'postcss-loader'
      ])
    }
    ]//, //noParse: [
      // /react.*\.js$/,
      ///d3.*\.js$/,
      ///nvd3.*\.js$/,
      ///d3.v3.5.min.*\.js$/,
      ///TweenMax.min.*\.js$///,
      // /react-router.*\.js$/,
      // /react-dom.*\.js$/
    //]
  }
};
