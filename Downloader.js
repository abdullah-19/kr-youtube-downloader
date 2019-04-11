const { ipcMain, shell } = require('electron');
const Url = require('./Url');
const youtubedl = require('youtube-dl');

module.exports = class Downloader {
    constructor(app, win) {
        this.app = app;
        this.win = win;
        this.url = new Url();
        this.setIpcEvents();
    }

    setIpcEvents() {
        this.setPlaylistDownloadEvent();
        this.setLoadEvent();
    }

    setLoadEvent() {
        ipcMain.on('start_load', function (event, info) {
            var url;
            console.log('in load');
            if (info.type === "playlist") {
                var id = JSON.parse(info.list[info.currentLoadItem]).id;
                url = this.url.getUrlFromId(id);
                info.url = url;
            }

            else if (info.type === "single") {
                url = info.url;
            }

            this.loadUsingYDL(info);

        })
    }

    loadUsingYDL(info) {
        var filename;
        var downloadPath;

        //var options = ['--username=user', '--password=hunter2'];
        var options = ['--format=18', '--skip-download'];
        youtubedl.getInfo(info.url, options, function (err, loadedInfo) {
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

            if (fs.existsSync(path.join(destination_folder, loadedInfo._filename))) {
                this.win.webContents.send('already_downloaded', info);
            }
            else if (fs.existsSync(path.join(app.getAppPath(), "downloads", loadedInfo._filename))) {
                this.win.webContents.send('already_downloadeding', info);
            }
            else {
                videoInfo = loadedInfo;
                console.log('thumbnail url:' + loadedInfo.thumbnails[0].url);
                filename = loadedInfo._filename;
                downloadPath = path.join(app.getAppPath(), "downloads", filename);
                loadedInfo.appPath = app.getAppPath();
                loadedInfo.downloadFilePath = downloadPath;
                this.win.webContents.send('load-complete', info);
            }

        });
    }


    setPlaylistDownloadEvent() {
        ipcMain.on('start_playlist_download', function (event, arg) {
            this.download_videoList(arg);
        })
    }

    download_videoList(url) {
        youtubedl.exec(url, ['-j', '--flat-playlist'], {}, function (err, output) {
            if (err) throw err;
            var info = {};
            info.type = "playlist";
            info.folderName = "playlist:" + getDateTime();
            info.list = output;
            info.currentDownloadItem = 0;
            info.currentLoadItem = 0;
            this.win.webContents.send('video-list', info);
        });
    }

    getDateTime() {
        var date = new Date();
        var time = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        var date = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
        return time + " " + date;
    }
}