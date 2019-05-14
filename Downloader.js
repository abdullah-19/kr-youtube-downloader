const { ipcMain, shell } = require('electron');
const Url = require('./Url');
const Item = require('./Item');
const Info = require('./Info');
const log = require('./Logger');
const config = require('./config');
const youtubedl = require('youtube-dl');
const fs = require('fs');
const path = require('path');
module.exports = class Downloader {
    constructor(app, win) {
        this.app = app;
        this.win = win;
        this.numberOfItemInProgress=0;
        this.queue = [];
        this.url = new Url();
        this.info = new Info(this.app,this.win);
        this.downloadDir = path.join(this.app.getPath('videos'), "kr_youtube_downloader");
        this.setIpcEvents();
        this.makeDestinationDir();
    }

    setIpcEvents() {
        //this.setPlaylistDownloadEvent();
        this.setLoadEvent();
        this.setStartDownloadEvent();
        this.setProcessEvent();
    }

    setProcessEvent(){
        ipcMain.on('start-process', (event, url) => {
            this.startDownloadProcess(url);
        })
    }

    startDownloadProcess(url){
        var item = new Item();
        item.url = url;
        item.isPlayliist = this.url.is_playlist(url);
        item.id = this.url.getIdFromUrl(url);
        if(item.isPlayliist){
            item.folderName = "playlist" + this.getDateTime();
            item.destinationPath  = path.join(this.downloadDir,item.folderName);
            //var dir = path.join(this.downloadDir,item.folderName);
            this.createFolder(item.destinationPath);
            this.download_videoList(item);
        }
        else{
            item.destinationPath = this.downloadDir;
            this.loadInfo(item);
        }
        
    }

    makeDestinationDir(){
        log.debug('-------makeDestinationDir-------');
        var destination = path.join(this.app.getPath('videos'),"kr_youtube_downloader");
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
            this.loadInfo(info);

        });
    }

    setStartDownloadEvent() {
        ipcMain.on('start_download', (event, info) => {
            // video_url = arg;
            var url;
            console.log("-----------in ipcMain start_download------------");
            if (info.type === "playlist") {
                var id = JSON.parse(info.list[info.currentDownloadItem]).id;
                url = this.url.getUrlFromId(id);
                info.url = url;
            }

            this.downloadUsingYDL(info);
            //this.loadInfo(info);
        })
    }

    // async loadInfo(info) {

    //     var filename;
    //     var downloadPath;
    //     console.log('----------in fun loadInfo-------------');
    //     log.debug('url:'+info.url);
    //     //info.loadedInfo = await this.info.getVideoInfo(this.url.getIdFromUrl(info.url));
    //     this.info.getVideoInfo(this.url.getIdFromUrl(info.url)).then((loadedInfo) => {
    //         info.loadedInfo = loadedInfo;
    //         log.debug('filename');
    //         log.debug(info.loadedInfo._filename);
    //         log.debug('folder name');
    //         log.debug(info.downloadDir);


    //         if (fs.existsSync(path.join(this.downloadDir,info.folderName, info.loadedInfo._filename))) {
    //             this.win.webContents.send('already_downloaded', info);
    //             log.debug('already downloaded');
    //         }
    //         else if (fs.existsSync(path.join(this.app.getAppPath(), "downloads", info.loadedInfo._filename))) {
    //             this.win.webContents.send('already_downloadeding', info);
    //             log.debug('already downloading');
    //         }
    //         else {
    //             // videoInfo = loadedInfo;
    //             log.debug('thumbnail url:' + info.loadedInfo.thumbnails[0].url);
    //             filename = info.loadedInfo._filename;
    //             downloadPath = path.join(this.app.getAppPath(), "downloads", filename);
    //             info.loadedInfo.appPath = this.app.getAppPath();
    //             info.loadedInfo.downloadFilePath = downloadPath;
    //             this.win.webContents.send('load-complete', info);
    //         }

    //     }).catch((error) => {
    //         console.log('Error from getVideoinfo with async( When promise gets rejected ): ' + error);
    //     });

    // }

    // setDownloadCompleteEvent() {
    //     ipcMain.on('download-complete', (event, info) => {
    //         move(info.downloadFilePath, path.join(app.getPath('videos'), "kr_youtube_downloader", info._filename), info, (err) => {
    //             console.log(err);
    //         });
    //     });
    // }


    async loadInfo(item) {

        var filename;
        var downloadPath;
        console.log('----------in fun loadInfo-------------');
        log.debug('url:'+info.url);
        //info.loadedInfo = await this.info.getVideoInfo(this.url.getIdFromUrl(info.url));
        this.info.getVideoInfo(this.url.getIdFromUrl(item.url)).then((loadedInfo) => {
            item.infoAtLoad = loadedInfo;
            log.debug('filename');
            log.debug(item.infoAtLoad._filename);
            log.debug('folder name');
            log.debug(item.folderName);


            if (fs.existsSync(path.join(item.destinationPath, item.infoAtLoad._filename))) {
                this.win.webContents.send('already_downloaded', item);
                log.debug('already downloaded');
            }
            else if (fs.existsSync(path.join(config.downloadPath, item.infoAtLoad._filename))) {
                this.win.webContents.send('already_downloadeding', item);
                log.debug('already downloading');
            }
            else {
                // videoInfo = loadedInfo;
                log.debug('thumbnail url:' + item.infoAtLoad.thumbnails[0].url);
                filename = item.infoAtLoad._filename;
                downloadPath = path.join(config.downloadPath, filename);
                //item.infoAtLoad.appPath = this.app.getAppPath();
                item.infoAtLoad.downloadFilePath = downloadPath;
                this.win.webContents.send('load-complete', item);
            }

        }).catch((error) => {
            console.log('Error from getVideoinfo with async( When promise gets rejected ): ' + error);
        });

    }

    loadUsingYDL(item) {
        log.debug('in fun loadUsingYDL');
        var filename;
        var downloadPath;

        //var options = ['--username=user', '--password=hunter2'];
        var options = ['--format=18', '--skip-download'];
        youtubedl.getInfo(item.url, options, (err, loadedInfo) => {
            if (err) throw err;
            // console.log('from video info');
            // console.log('id:', loadedInfo.id);
            // console.log('title:', loadedInfo.title);
            // console.log('url:', loadedInfo.url);
            // console.log('thumbnail:', loadedInfo.thumbnail);
            // console.log('description:', loadedInfo.description);
            // console.log('filename:', loadedInfo._filename);
            // console.log('format id:', loadedInfo.format_id);
            // return info;


            item.infoAtLoad = loadedInfo;

            if (fs.existsSync(path.join(this.downloadDir, item.infoAtLoad._filename))) {
                this.win.webContents.send('already_downloaded', item);
            }
            else if (fs.existsSync(path.join(this.app.getAppPath(), "downloads", item.infoAtLoad._filename))) {
                this.win.webContents.send('already_downloadeding', item);
            }
            else {
                // videoInfo = loadedInfo;
                log.debug('thumbnail url:' + item.infoAtLoad.thumbnails[0].url);
                filename = item.infoAtLoad._filename;
                downloadPath = path.join(this.app.getAppPath(), "downloads", filename);
                item.infoAtLoad.appPath = this.app.getAppPath();
                item.infoAtLoad.downloadFilePath = downloadPath;
                this.win.webContents.send('load-complete', item);
            }

        });
    }


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
        log.debug('-------------in fun download_videoList-----------------');
        youtubedl.exec(url, ['-j', '--flat-playlist'], {}, (err, output) => {
            if (err) throw err;
            // var info = {};
            // info.type = "playlist";
            //item.folderName = "playlist" + this.getDateTime();
            //var dir = path.join(this.downloadDir,item.folderName);
            //this.createFolder(dir);
            item.list = output;
            //this.win.webContents.send('video-list', item);
            this.processPlaylist(item);

        });
    }

    processPlaylist(item){
        
    }
    createFolder(dir){
        //var dir = path.join(this.app.getPath('videos'), "kr_youtube_downloader",name);
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
    }
    downloadUsingYDL(info) {
        var filename;
        var downloadPath;
        //console.log('in downloadUsingYDL');
        //console.log(info);
        log.debug('------------in fun downloadUsingYDL-------------');
        log.debug('downlaod video url:' + info.url);

        var video = youtubedl(info.url,
            ['--format=18'],//"%(title)s.%(ext)s"
            { cwd: __dirname , maxBuffer: Infinity});

        video.on('info', (loadedInfo) => {
            info.loadedInfo = loadedInfo;

            if (fs.existsSync(path.join(this.downloadDir, loadedInfo._filename))) {
                this.win.webContents.send('already_downloaded', info);
            }
            else if (fs.existsSync(path.join(this.app.getAppPath(), "downloads", loadedInfo._filename))) {
                this.win.webContents.send('already_downloadeding', info);
            }
            else {
                //var videoInfo = loadedInfo;

                //console.log(info);
                log.debug('thumbnail url:' + loadedInfo.thumbnails[0].url);
                filename = loadedInfo._filename;
                downloadPath = path.join(this.app.getAppPath(), "downloads", filename);
                video.pipe(fs.createWriteStream(downloadPath));
                //fs.createWriteStream("downloads/" + filename));
                loadedInfo.appPath = this.app.getAppPath();
                loadedInfo.downloadFilePath = downloadPath;
                //console.log('download path:');
                //console.log(info.appPath);
                this.win.webContents.send('download-started', info);
            }
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