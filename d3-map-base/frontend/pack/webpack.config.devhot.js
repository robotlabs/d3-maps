var path = require('path');
var webpack = require('webpack');
var config = require('./config');
var EmptyFilePlugin = require('./plugins/create-emptyfile-plugin');

var gaugePlugin = require('gauge-webpack-plugin');

module.exports = {
  target: 'web',
  devtool: 'cheap-module-eval-source-map',//'cheap-module-source-map',
  entry: config.entryDevhot,
  output: {
    path: '/js/',
    filename: '[name].js',
    publicPath: '/js/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    gaugePlugin('Build Completed'),

    new EmptyFilePlugin(
      {
        entry: config.entryDevhot,
        outputCss: config.outputPath.absoluteCssPath
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
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: [/node_modules/, /vendor/, /support\/fixtures/],
        include: path.join(__dirname, './../src')
      },
      // {
      //   test: /\.css$/,
      //   loader: 'style!css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss-loader'
      // }
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              importLoaders: 1,
              localIdentName: '[local]-[hash:base64:5]'
            }
          },
          'postcss-loader'
        ]
      }
    ]}
};
