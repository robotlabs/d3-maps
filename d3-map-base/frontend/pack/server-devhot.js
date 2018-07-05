var webpack = require('webpack');
var express = require('express');
var config = require('./webpack.config.devhot');
var proxy = require('express-http-proxy');
var open = require('open');
var app = express();
var utils = require('./utils.js');

//** connect to devhot config
var compiler = webpack(config);

console.log('+++++++++++++++');
console.log(config.output.publicPath);

app.use(require('webpack-dev-middleware')(compiler, {

  publicPath: config.output.publicPath,//'/../js/',
  stats: {colors: true}
}));

app.use(require('webpack-hot-middleware')(compiler, {
  publicPath: config.output.publicPath//'/../js/',
}));

var serverProxy = utils.parseServerProxy(process.argv[2]);
app.use('/', proxy(serverProxy));

app.listen(3000, function(err) {
  if (err) {
    return console.error(err);
  }

  console.info('Listening at http://localhost:8000/');
});

//** start app

open('http://localhost:8000/');
