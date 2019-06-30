const {app} = require('electron');
const path = require('path');

const destinationDir = path.join(app.getPath('videos'),"kr_youtube_downloader");
const downloadDir = path.join(destinationDir, ".metadata");

const loggerPath = __dirname + '/../../';

var config_prod = {
  "logger": {
    "level": "info",
    "path": loggerPath,
    "size": 5 * 1024 * 1024,
    "filename": "log.txt"
  },
  "downloadDir":downloadDir,
  "destinationDir":destinationDir,
  "isProduction": true
}

module.exports = config_prod;