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
        //this.makeDestinationDir();
        this.makeDirectories();
        this.setStartSingleVideoDownloadEvent();
    }

    makeDirectories(){
        log.debug('---makeDirectories---');
        log.debug('creating destinationDir');
        this.createFolder(config.destinationDir);
        log.debug('creating downloadDir');
        this.createFolder(config.downloadDir);
    }

    setIpcEvents() {
        //this.setPlaylistDownloadEvent();
        this.setLoadEvent();
        // this.setStartDownloadEvent();
        this.setProcessEvent();
        this.setNextItemLoadEvent();
        this.setNextItemDownloadEvent();
    }


    // setTryAgainPlaylistItemEvent(){
    //     log.debug('--setTryAgainPlaylistItemEvent---');
    //     ipcMain.on('retry-load-playlist-item',(event,item)=>{
    //         log.debug('in ipcMain try-again-load-playlist-item');
    //         this.loadInfo(item);
    //     })
    // }

    startLoadPlaylistItem(){
        log.debug('---startLoadPlaylistItem---');
        ipcMain.on('start-load-playlist-item',(event,item)=>{
            this.loadListItem(item);
        })
    }

    setNextItemDownloadEvent(){
        log.debug('---setNextItemDownloadEvent-----');
        ipcMain.on('download-playlist-item',(event,item)=>{
            log.debug('---in ipcMain download-playlist-item----');
            this.downloadPlaylistItem(item);
        });
    }

    setStartSingleVideoDownloadEvent() {
        ipcMain.on('start-single-video-download', (event, item) => {
            console.log('---start-single-video-download---');
            this.processForDownload(item);
        })
    }

    setNextItemLoadEvent() {
        ipcMain.on('load-playlist-item', (event, item) => {
            //this.loadListItem(item);
            let url = this.url.getUrlFromId(JSON.parse(item.list[item.loadIndex]).id);
            this.loadInfo(url,item);
        });
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
        console.log(url);
        let loadedInfo;
        try{
            loadedInfo = await this.info.getVideoInfo(this.url.getIdFromUrl(url));
        }catch(err){
            console.log('error happened in video info');
        }
        
        item.infoAtLoad = loadedInfo;

        if (fs.existsSync(path.join(item.destinationDir, item.infoAtLoad._filename))) {
            this.win.webContents.send('already-downloaded', item);
            log.debug('already downloaded');
            log.debug('destination path:' + item.destinationDir);
        }
        else if (fs.existsSync(path.join(config.downloadDir, item.infoAtLoad._filename))) {
            this.win.webContents.send('already-downloadeding', item);
            log.debug('already downloading');
            //this.win.webContents.send("already-inProgress",item);
        }
        else {

            this.win.webContents.send('load-complete', item);
            //here vulnerability of asynchronous item attribute change 
            // if (item.isPlaylist) {
            //     this.loadListItem(item);
            // }
            // else this.processForDownload(item);
        }

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

    async downloadPlaylist(item) {
        console.log('-----downloadPlaylist-----');
        if (this.queue.length < 6) {
            this.win.webContents.send('downloading-playlist', item);
           // await this.loadListItem(item);
            this.downloadListItem(item);
        }
        else {
            this.queue.push(item);
        }
        //this.downloadListItem(item);
    }

    async loadListItem(item) {
        console.log('-----loadListItem-----');
        item.loadIndex++;
        if (item.loadIndex < item.list.length) {
            log.debug('loadIndex:' + item.loadIndex);
            let id = JSON.parse(item.list[item.loadIndex]).id;
            let url = this.url.getUrlFromId(id);
           // this.win.webContents.send('starting-load',item);
            await this.loadInfo(url, item);
        }

    }

    downloadListItem(item) {
        console.log('----downloadListItem-----');
        item.downloadIndex++;
        if (item.downloadIndex < item.list.length) {
            this.win.webContents.send('check-load-of-playlist-item',item);

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
        return new Promise((resolve) => {


            var video = youtubedl(url,
                ['--format=18'],
                { cwd: __dirname, maxBuffer: Infinity, timeout:1000*15 });

            video.on('info', (loadedInfo) => {
                item.infoAtDownload = loadedInfo;
                let downloadPath = path.join(config.downloadDir, loadedInfo._filename);
                video.pipe(fs.createWriteStream(downloadPath));
                resolve(video);
            });

        }).catch(error => {
            log.debug('error in downloadVideo:' + error.message);
        });

    }

    getDateTime() {
        var date = new Date();
        var time = date.getHours() + "_" + date.getMinutes() + "_" + date.getSeconds();
        var str_date = date.getFullYear() + '.' + (date.getMonth() + 1) + '.' + date.getDate();
        return time + " " + str_date;
    }

}