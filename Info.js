
const { ipcMain, shell } = require('electron');
const Url = require('./Url');
const youtubedl = require('youtube-dl');
const fs = require('fs');

module.exports = class Info {
    constructor(app, win) {
        
    }

    getVideoInfo(url) {
        //var url = 'http://www.youtube.com/watch?v=WKsjaOqDXgg';
        // Optional arguments passed to youtube-dl.
        var options = ['--username=user', '--password=hunter2'];
        youtubedl.getInfo(url, options, function (err, info) {
          if (err) throw err;
          console.log('from video info');
          console.log('id:', info.id);
          console.log('title:', info.title);
          console.log('url:', info.url);
          console.log('thumbnail:', info.thumbnail);
          console.log('description:', info.description);
          console.log('filename:', info._filename);
          console.log('format id:', info.format_id);
          return info;
        });
      }
}