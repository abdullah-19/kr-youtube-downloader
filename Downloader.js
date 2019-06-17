const { ipcMain, shell } = require('electron');
const Url = require('./Url');
const Item = require('./Item');
const Info = require('./Info');
const log = require('./Logger');
const FileManager = require('./FileManager');
const config = require('./config');
const youtubedl = require('youtube-dl');
const fs = require('fs');
const path = require('path');

module.exports = class Downloader {
    constructor(app, win) {
        this.app = app;
        this.win = win;
        this.numberOfItemInProgress = 0;
        this.queue = [];
        this.url = new Url();
        this.info = new Info(this.app, this.win);
        this.fileManager = new FileManager(this.app, this.win);
        this.setIpcEvents();
        this.makeDestinationDir();
    }

    setIpcEvents() {
        //this.setPlaylistDownloadEvent();
        this.setLoadEvent();
        // this.setStartDownloadEvent();
        this.setProcessEvent();
    }

    setProcessEvent() {
        ipcMain.on('start-process', (event, url) => {
            this.startProcess(url);
        });
    }

    startProcess(url) {
        log.debug('------startProcess-----');
        var item = new Item();
        item.url = url;
        item.isPlaylist = this.url.is_playlist(url);
        if (item.isPlaylist) {
            item.id = this.url.getPlaylistId(url);
            item.folderName = "playlist" + this.getDateTime();
            item.destinationDir = path.join(config.destinationDir, item.folderName);
            //var dir = path.join(this.downloadDir,item.folderName);
            this.createFolder(item.destinationDir);
            this.download_videoList(item);
        }
        else {
            item.id = this.url.getIdFromUrl(url);
            item.destinationDir = config.destinationDir;
            this.loadInfo(url, item);
        }

    }

    makeDestinationDir() {
        log.debug('-------makeDestinationDir-------');
        var destination = path.join(this.app.getPath('videos'), "kr_youtube_downloader");
        this.createFolder(destination);
    }
    setLoadEvent() {
        ipcMain.on('start-load', (event, info) => {
            var url;
            log.debug('------in ipcMain start-load-------');
            if (info.type === "playlist") {
                var id = JSON.parse(info.list[info.currentLoadItem]).id;
                url = this.url.getUrlFromId(id);
                info.url = url;
            }

            // else if (info.type === "single") {
            //     url = info.url;
            // }
            // this.loadUsingYDL(info);
            // this.loadInfo(info);

        });
    }

    async loadInfo(url, item) {

        console.log('----------loadInfo-------------');
        this.info.getVideoInfo(this.url.getIdFromUrl(url)).then((loadedInfo) => {
            item.infoAtLoad = loadedInfo;

            if (fs.existsSync(path.join(item.destinationDir, item.infoAtLoad._filename))) {
                this.win.webContents.send('already-downloaded', item);
                log.debug('already downloaded');
                //this.win.webContents.send("already-downloaded",item);
            }
            else if (fs.existsSync(path.join(config.downloadDir, item.infoAtLoad._filename))) {
                this.win.webContents.send('already-downloadeding', item);
                log.debug('already downloading');
                //this.win.webContents.send("already-inProgress",item);
            }
            else {
                this.win.webContents.send('load-complete', item);
                //here vulnerability of asynchronous item attribute change 
                if (item.isPlaylist) {
                    this.loadListItem(item);
                }
                else this.processForDownload(item);
            }

        }).catch((error) => {
            console.log('Error from getVideoinfo with async( When promise gets rejected ): ' + error);
        });

    }

    loadNextPlaylistItem(item) {
        item.loadIndex++;
        if (item.loadIndex >= item.list.length) {
            let id = JSON.parse(item.list[item.loadIndex]).id;
            let url = this.url.getUrlFromId(id);
            this.loadInfo(url, item);
        }

    }

    processForDownload(item) {
        log.debug('----processForDownload---');
        if (this.numberOfItemInProgress < 6) {
            if (item.isPlaylist) this.downloadPlaylist(item);
            else this.downloadSingleVideo(item);
        }
        else this.queue.push(item);
    }

    async downloadSingleVideo(item) {
        log.debug('----downloadSingleVideo------');
        var size = item.infoAtLoad.filesize;
        let video = await this.downloadVideo(item.url, item);
        var pos = 0;
        var progressInfo = {};
        var percent = 0;
        progressInfo.id = item.id;
        video.on('data', function data(chunk) {
            pos += chunk.length;
            if (size) {
                percent = Math.floor((pos / size) * 100);
                //log.debug('percent:' + percent + "%");
            }
        });
        this.win.webContents.send('download-started', item);

        var f = setInterval(() => {
            progressInfo.percent = percent;
            this.win.webContents.send('download-progress', progressInfo);
        }, 1000);

        video.on('end', () => {
            log.debug('--- video.on(\'end\')---');
            clearInterval(f);
            var filename = item.infoAtDownload._filename;
            var srcPath = path.join(config.downloadDir, filename);
            var destinationPath = path.join(item.destinationDir, filename);
            this.fileManager.move(srcPath, destinationPath, item,
                function (message) {
                    log.debug(message);
                });

            //this.win.webContents.send('download-complete', item);


            // var f2 = setInterval(() => {
            //     if (percent == 100) {
            //         clearInterval(f);
            //         clearInterval(f2);

            //     }
            // }, 1000);

        });
    }

    downloadPlaylist(item) {
        console.log('-----downloadPlaylist-----');
        if (this.queue.length < 6) {
            this.win.webContents.send('downloading-playlist', item);
            this.loadListItem(item);
            this.downloadListItem(item);
        }
        else {
            this.queue.push(item);
        }
        //this.downloadListItem(item);
    }

    loadListItem(item) {
        console.log('-----loadListItem-----');
        item.loadIndex++;
        if (item.loadIndex < item.list.length) {
            log.debug('loadIndex:' + item.loadIndex);
            let id = JSON.parse(item.list[item.loadIndex]).id;
            let url = this.url.getUrlFromId(id);
            this.loadInfo(url, item);
        }

    }

    downloadListItem(item) {
        item.downloadIndex++;
        if (item.downloadIndex < item.list.length) {
            log.debug('downloadIndex:' + item.downloadIndex);
            //let id = JSON.parse(item.list[item.downloadIndex]).id;
           // let url = this.url.getUrlFromId(id);
            this.downloadPlaylistItem(item);
        }

    }

    writeInfoToFile(loadedInfo) {
        var jsonContent = JSON.stringify(loadedInfo);
        fs.writeFile("output.json", jsonContent, 'utf8', function (err) {
            if (err) {
                console.log("An error occured while writing JSON Object to File.");
                return console.log(err);
            }

            console.log("JSON file has been saved.");
        });
    }

    // loadUsingYDL(item) {
    //     log.debug('in fun loadUsingYDL');
    //     var filename;
    //     var downloadPath;

    //     var options = ['--format=18', '--skip-download'];
    //     youtubedl.getInfo(item.url, options, (err, loadedInfo) => {
    //         if (err) throw err;
    //         item.infoAtLoad = loadedInfo;
    //         if (fs.existsSync(path.join(config.destinationDir, item.infoAtLoad._filename))) {
    //             this.win.webContents.send('already_downloaded', item);
    //         }
    //         else if (fs.existsSync(path.join(this.app.getAppPath(), "downloads", item.infoAtLoad._filename))) {
    //             this.win.webContents.send('already_downloadeding', item);
    //         }
    //         else {
    //             log.debug('thumbnail url:' + item.infoAtLoad.thumbnails[0].url);
    //             filename = item.infoAtLoad._filename;
    //             downloadPath = path.join(this.app.getAppPath(), "downloads", filename);
    //             item.infoAtLoad.appPath = this.app.getAppPath();
    //             item.infoAtLoad.downloadFilePath = downloadPath;
    //             this.win.webContents.send('load-complete', item);
    //         }

    //     });
    // }


    // setPlaylistDownloadEvent() {
    //     log.debug('-------------in fun setPlaylistDownloadEvent-----------------');
    //     ipcMain.on('start-playlist-download', (event, url) => {
    //         log.debug('----------in ipcMain start_playlist_download---------------');
    //         this.download_videoList(url);
    //     })
    // }

    // download_videoList(url) {
    //     log.debug('-------------in fun download_videoList-----------------');
    //     youtubedl.exec(url, ['-j', '--flat-playlist'], {}, (err, output) => {
    //         if (err) throw err;
    //         var info = {};
    //         info.type = "playlist";
    //         info.folderName = "playlist" + this.getDateTime();
    //         var dir = path.join(this.app.getPath('videos'), "kr_youtube_downloader",info.folderName);
    //         this.createFolder(dir);
    //         info.list = output;
    //         info.currentDownloadItem = 0;
    //         info.currentLoadItem = 0;
    //         this.win.webContents.send('video-list', info);
    //     });
    // }


    download_videoList(item) {

        log.debug('------download_videoList--------');
        var url = item.url;
        youtubedl.exec(url, ['-j', '--flat-playlist'], {}, (err, output) => {
            if (err) throw err;
            item.list = output;
            this.win.webContents.send('list-downloaded', item);
            this.downloadPlaylist(item);

        });
    }

    async downloadPlaylistItem(item) {

        log.debug('----downloadPlaylistItem------');
        //var size = item.infoAtDownload.filesize;
        var id = JSON.parse(item.list[item.downloadIndex]).id;
        var url = this.url.getUrlFromId(id);
        let video = await this.downloadVideo(url, item);
        var size = item.infoAtDownload.filesize;
        var pos = 0;
        var progressInfo = {};
        var percent = 0;
        progressInfo.id = item.infoAtDownload.id;
        video.on('data', function data(chunk) {
            pos += chunk.length;
            if (size) {
                percent = Math.floor((pos / size) * 100);
              //  log.debug('percent:' + percent + "%");
            }
        });
        this.win.webContents.send('download-started', item);

        var f = setInterval(() => {
            progressInfo.percent = percent;
            this.win.webContents.send('playlist-download-progress', progressInfo);
        }, 1000);

        video.on('end', () => {
            log.debug('--- video.on(\'end\')---');
            clearInterval(f);
            var filename = item.infoAtDownload._filename;
            var srcPath = path.join(config.downloadDir, filename);
            var destinationPath = path.join(item.destinationDir, filename);
            this.fileManager.move(srcPath, destinationPath, item,
                function (message) {
                    log.debug(message);
                });
            this.downloadListItem(item);

        });
    
    }

    createFolder(dir) {
        log.debug('---createFolder----');
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
    }


    downloadVideo(url, item) {
        log.debug('------downloadVideo-------');

        // var video = youtubedl(url,
        //     ['--format=18'],
        //     { cwd: __dirname, maxBuffer: Infinity });

        // video.on('info', (loadedInfo) => {
        //     item.infoAtDownload = loadedInfo;
        //     let downloadPath = path.join(config.downloadDir, loadedInfo._filename);
        //     video.pipe(fs.createWriteStream(downloadPath));
        // });

        // return video;


        return new Promise((resolve, reject) => {


            var video = youtubedl(url,
              ['--format=18'],
              { cwd: __dirname, maxBuffer: Infinity });
      
            video.on('info', (loadedInfo) => {
                item.infoAtDownload = loadedInfo;
                let downloadPath = path.join(config.downloadDir, loadedInfo._filename);
                video.pipe(fs.createWriteStream(downloadPath));
                resolve(video);
            });
      
          }).catch(error =>{
              log.debug('error:'+error.message);
          });


    }


    downloadUsingYDL(item) {
        var filename;
        var downloadPath;
        log.debug('------------in fun downloadUsingYDL-------------');

        var video = youtubedl(info.url,
            ['--format=18'],
            { cwd: __dirname, maxBuffer: Infinity });

        video.on('info', (loadedInfo) => {
            info.loadedInfo = loadedInfo;
            log.debug('thumbnail url:' + loadedInfo.thumbnails[0].url);
            filename = loadedInfo._filename;
            downloadPath = path.join(this.app.getAppPath(), "downloads", filename);
            video.pipe(fs.createWriteStream(downloadPath));
            loadedInfo.appPath = this.app.getAppPath();
            loadedInfo.downloadFilePath = downloadPath;
            this.win.webContents.send('download-started', info);

        });

    }

    getDateTime() {
        var date = new Date();
        var time = date.getHours() + "_" + date.getMinutes() + "_" + date.getSeconds();
        var str_date = date.getFullYear() + '.' + (date.getMonth() + 1) + '.' + date.getDate();
        return time + " " + str_date;
    }

    download_thumbnail(event, url) {
        var command = preperCommandForThumbnail(url);
        execute(command, (output, error) => {
            if (error != null) {
                console.log('thumbnail eror');
                event.sender.send('download_error');
            }

            else {
                console.log('thumbnail download success');
                console.log(output);
                var thumbnail_destination = output.split("Writing thumbnail to")[1].split("\n")[0];
                var thumbailDestinationWithoutExtension = thumbnail_destination.substr(0, thumbnail_destination.lastIndexOf('.'));
                var thumbnailName = thumbailDestinationWithoutExtension.substr(thumbailDestinationWithoutExtension.lastIndexOf
                    (path.sep) + 1, thumbailDestinationWithoutExtension.length - 1);

                console.log('thumbnail destination:' + thumbnail_destination);
                console.log('thumbnail name:' + thumbnailName);
                event.sender.send('downloaded-thumbnail', thumbnailName);
            }

        });
    }

    preperCommand(url) {
        var plugin_path = path.join("\"" + __dirname + "\"", "downloads", "youtube-dl");
        var command;

        console.log("download_path:" + download_path);

        if (url.indexOf("playlist?list=") != -1) {
            command = plugin_path + " -i -f mp4 --yes-playlist -o " + download_path + " " + url;
            return command;
        }
        else {
            console.log("splitted Link:" + url.split("&")[0]);
            command = plugin_path + " -o " + download_path + " " + url.split("&")[0];
            console.log("command:" + command);
            return command;
        }
    }

    preperCommandForThumbnail(url) {
        var plugin_path = path.join("\"" + __dirname + "\"", "downloads", "youtube-dl");
        var thumbnail_path = path.join("\"" + __dirname + "\"", "downloads", "thumbnail", "%(title)s");
        var command;

        //console.log("download_path:" + download_path);

        if (url.indexOf("playlist?list=") != -1) {
            command = plugin_path + " -i -f mp4 --yes-playlist -o " + download_path + " " + url;
            return command;
        }
        else {
            console.log("splitted Link:" + url.split("&")[0]);
            command = plugin_path + " --skip-download --write-thumbnail" + " -o " + thumbnail_path + " " + url.split("&")[0];
            console.log("thumbnail command:" + command);
            return command;
        }
    }

    execute(command, callback) {
        exec(command, (error, stdout, stderr) => {
            callback(stdout, error);
        });
    }

}