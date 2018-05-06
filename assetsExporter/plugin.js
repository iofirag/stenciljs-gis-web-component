const CSSDataURI = require('./exporter');
const path = require("path");

module.exports = function assets() {
  return {
    transform: function (sourceText, fileName, context) {
      return new Promise(function (resolve) {
        if (fileName.match(/\.s?css$/)) {
          (new CSSDataURI()).on('success', function (content) {
            resolve(content);
          }).on('error', function (err) {
          }).encode(path.resolve(fileName), 'tmp/default_options');
        }
        else {
          resolve(sourceText);
        }
      });
    }
  }
}
