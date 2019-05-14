const {app} = require('electron');
const path = require('path');
const loggerPath = __dirname;
const downloadPath = path.join(app.getAppPath(), "downloads");
const destinationPath = path.join(app.getPath('videos'),"kr_youtube_downloader");


var config = {
  "logger": {
    "level": "debug",
    "path": loggerPath,
    "size": 5 * 1024 * 1024,
    "filename": "log.txt"
  },
  "downloadPath":downloadPath,
  "destinationPath":destinationPath,
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
