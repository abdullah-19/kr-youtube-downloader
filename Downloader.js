const { ipcMain, shell } = require('electron');
const Url = require('./Url');
const Info = require('./Info');
const log = require('./Logger');
const youtubedl = require('youtube-dl');
const fs = require('fs');
const path = require('path');
module.exports = class Downloader {
    constructor(app, win) {
        this.app = app;
        this.win = win;
        this.url = new Url();
        this.info = new Info(this.app,this.win);
        this.destination_folder = path.join(this.app.getPath('videos'), "kr_youtube_downloader");
        this.setIpcEvents();
    }

    setIpcEvents() {
        this.setPlaylistDownloadEvent();
        this.setLoadEvent();
        this.setStartDownloadEvent();
    }

    setLoadEvent() {
        ipcMain.on('start_load', (event, info) => {
            var url;
            log.debug('in ipcMain start_load ');
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

    async loadInfo(info) {

        var filename;
        var downloadPath;
        console.log('----------in fun loadInfo-------------');
        //info.loadedInfo = await this.info.getVideoInfo(this.url.getIdFromUrl(info.url));
        this.info.getVideoInfo(this.url.getIdFromUrl(info.url)).then((loadedInfo) => {
            info.loadedInfo = loadedInfo;
            log.debug('filename');
            log.debug(info.loadedInfo._filename);

            if (fs.existsSync(path.join(this.destination_folder, info.loadedInfo._filename))) {
                this.win.webContents.send('already_downloaded', info);
            }
            else if (fs.existsSync(path.join(this.app.getAppPath(), "downloads", info.loadedInfo._filename))) {
                this.win.webContents.send('already_downloadeding', info);
            }
            else {
                // videoInfo = loadedInfo;
                log.debug('thumbnail url:' + info.loadedInfo.thumbnails[0].url);
                filename = info.loadedInfo._filename;
                downloadPath = path.join(this.app.getAppPath(), "downloads", filename);
                info.loadedInfo.appPath = this.app.getAppPath();
                info.loadedInfo.downloadFilePath = downloadPath;
                this.win.webContents.send('load-complete', info);
            }

        }).catch((error) => {
            console.log('Error from getVideoinfo with async( When promise gets rejected ): ' + error);
        });

    }

    // setDownloadCompleteEvent() {
    //     ipcMain.on('download-complete', (event, info) => {
    //         move(info.downloadFilePath, path.join(app.getPath('videos'), "kr_youtube_downloader", info._filename), info, (err) => {
    //             console.log(err);
    //         });
    //     });
    // }

    loadUsingYDL(info) {
        log.debug('in fun loadUsingYDL');
        var filename;
        var downloadPath;

        //var options = ['--username=user', '--password=hunter2'];
        var options = ['--format=18', '--skip-download'];
        youtubedl.getInfo(info.url, options, (err, loadedInfo) => {
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


            info.loadedInfo = loadedInfo;

            if (fs.existsSync(path.join(this.destination_folder, loadedInfo._filename))) {
                this.win.webContents.send('already_downloaded', info);
            }
            else if (fs.existsSync(path.join(this.app.getAppPath(), "downloads", loadedInfo._filename))) {
                this.win.webContents.send('already_downloadeding', info);
            }
            else {
                // videoInfo = loadedInfo;
                log.debug('thumbnail url:' + loadedInfo.thumbnails[0].url);
                filename = loadedInfo._filename;
                downloadPath = path.join(this.app.getAppPath(), "downloads", filename);
                loadedInfo.appPath = this.app.getAppPath();
                loadedInfo.downloadFilePath = downloadPath;
                this.win.webContents.send('load-complete', info);
            }

        });
    }


    setPlaylistDownloadEvent() {
        log.debug('-------------in fun setPlaylistDownloadEvent-----------------');
        ipcMain.on('start_playlist_download', (event, url) => {
            log.debug('----------in ipcMain start_playlist_download---------------');
            this.download_videoList(url);
        })
    }

    download_videoList(url) {
        log.debug('-------------in fun download_videoList-----------------');
        youtubedl.exec(url, ['-j', '--flat-playlist'], {}, (err, output) => {
            if (err) throw err;
            var info = {};
            info.type = "playlist";
            info.folderName = "playlist:" + this.getDateTime();
            info.list = output;
            info.currentDownloadItem = 0;
            info.currentLoadItem = 0;
            this.win.webContents.send('video-list', info);
        });
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

            if (fs.existsSync(path.join(this.destination_folder, loadedInfo._filename))) {
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
        var time = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        var str_date = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
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