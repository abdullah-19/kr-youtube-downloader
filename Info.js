
const { ipcMain, shell } = require('electron');
const Url = require('./Url');
const log = require('./Logger');
const youtubedl = require('youtube-dl');
const fs = require('fs');
const fetchVideoInfo = require('youtube-info');
const exec = require('child_process').exec;


module.exports = class Info {
  constructor(app, win) {
    this.app = app;
    this.win = win;
  }

  // getVideoInfo(url) {
  //   //var url = 'http://www.youtube.com/watch?v=WKsjaOqDXgg';
  //   // Optional arguments passed to youtube-dl.
  //   //var options = ['--username=user', '--password=hunter2'];
  //   log.debug('--------------in fun getVideoInfo----------------');
  //   return new Promise((resolve, reject) => {
  //     youtubedl.getInfo(url, [],{cwd: __dirname, maxBuffer: Infinity}, function (err, info) {
  //       if (err) throw err;
  //       log.debug('from video info');
  //       log.debug('id:', info.id);
  //       log.debug('title:', info.title);
  //       log.debug('url:', info.url);
  //       log.debug('thumbnail:', info.thumbnail);
  //       log.debug('description:', info.description);
  //       log.debug('filename:', info._filename);
  //       log.debug('format id:', info.format_id);
  //       resolve(info);
  //     });
  //   });
  // }

  // getInfo(id) {

  //   return new Promise((resolve, reject) => {
  //     fetchVideoInfo(id, (err, videoInfo) => {
  //       if (err) throw new Error(err);
  //       // if(err){
  //       //   reject(err);
  //       // }
  //       log.debug(videoInfo);
  //       //return videoInfo;
  //       resolve(videoInfo);
  //     });
  //   });

  // }

  // async getVideoInfo(url) {
  //   log.debug('------------------in getVideoInfo---------------');
  //   var command = this.app.getAppPath() + "/downloads/" + "youtube-dl -j " + url;
  //   var data = await this.execute(command);
  //   log.debug(data);
  //   return JSON.parse(data);
  // }

  // execute(command) {
  //   log.debug('------------in fun execute---------------');
  //   return new Promise((resolve, reject) => {
  //     exec(command, { maxBuffer: Infinity }, (error, stdout, stderr) => {
  //       if (error) throw new Error(error);
  //       resolve(stdout);
  //     });
  //   })

  // }

  getVideoInfo(url) {
    log.debug('------getVideoInfo-------');

    return new Promise((resolve) => {

      var video = youtubedl(url,
        ['--format=18'],
        { cwd: __dirname, maxBuffer: Infinity });

      video.on('info', (loadedInfo) => {
        resolve(loadedInfo);
      });

    }).catch((error) => {
      console.log('Error from getVideoinfo with async( When promise gets rejected ): ' + error);
    });
  }
}