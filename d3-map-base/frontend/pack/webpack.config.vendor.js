var webpack = require("webpack");
var config = require('./config');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  devtool: false,
  entry: config.entryVendorProd,
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
    })
  ],
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /(node_modules|vendor)/,
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
    ]
  }
};
