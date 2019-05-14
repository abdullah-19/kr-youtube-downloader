const {app} = require('electron');
const path = require('path');

const downloadPath = path.join(app.getAppPath(), "downloads");
const destinationPath = path.join(app.getPath('videos'),"kr_youtube_downloader");

const loggerPath = __dirname + '/../../';

var config_prod = {
  "logger": {
    "level": "info",
    "path": loggerPath,
    "size": 5 * 1024 * 1024,
    "filename": "log.txt"
  },
  "downloadPath":downloadPath,
  "destinationPath":destinationPath,
  "isProduction": true
}

module.exports = config_prod;