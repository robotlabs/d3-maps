function CreateEmptyFile(options) {
  this.options = options;
}

CreateEmptyFile.prototype.apply = function(compiler) {
  compiler.plugin('compile', function(params) {
  });
  var scope = this;
  compiler.plugin('compilation', function(compilation) {
    var fs = require('fs');
    for (var filename in scope.options.entry) {
      if (filename !== 'vendor' && filename !== 'script-loader') {
        fs.writeFile(__dirname + scope.options.outputCss + filename + '.css', '', function(err) {
          if (err) {
            return console.error(err);
          }
          console.info('CSS ' + filename + ' was saved!');
        });
      }
    }
  });
};

module.exports = CreateEmptyFile;
