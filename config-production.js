
const loggerPath = __dirname + '/../../';

var config_prod = {
  "logger": {
    "level": "info",
    "path": loggerPath,
    "size": 5 * 1024 * 1024,
    "filename": "log.txt"
  },
  "isProduction": true
}

module.exports = config_prod;