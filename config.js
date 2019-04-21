const loggerPath = __dirname;

var config = {
  "logger": {
    "level": "debug",
    "path": loggerPath,
    "size": 5 * 1024 * 1024,
    "filename": "log.txt"
  },
  "isProduction": false
};
//const debug = /--debug/.test(process.argv[2]);
const index = process.argv.indexOf('--debug');
// console.log('is debug:');
// console.log(debug);
if (index === -1) {
  var prod = require('./config-production');
  config = { ...config, ...prod };
}



module.exports = config;
