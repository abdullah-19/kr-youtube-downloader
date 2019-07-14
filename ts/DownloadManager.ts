import { app, BrowserWindow, ipcMain } from "electron";
import log from "./Logger";
import { Item, VideoInfo } from "./Item";
import path = require("path");
import config from "./config";
import fs = require('fs');
import youtubedl = require('youtube-dl');
import { UrlManager } from "./UrlManager";
import { InfoManager } from "./InfoManager";
import { FileManager } from "./FileManager";

interface progressInfo {
    id: string;
    percent: number;
}

export class DownloadManager {
    private win: BrowserWindow;
    private numberOfItemInProgress: number = 0;
    private queue: Item[] = [];
    private url = new UrlManager();
    private infoManager: InfoManager;
    private fileManager: FileManager;

    constructor(win: BrowserWindow) {
        this.win = win;
        this.infoManager = new InfoManager(this.win);
        this.fileManager = new FileManager(this.win);
        this.setIpcEvents();
        this.makeDirectories();
        this.setStartSingleVideoDownloadEvent();
    }

    makeDirectories() {
        log.debug('---makeDirectories---');
        log.debug('creating destinationDir');
        this.createFolder(config.destinationDir);
        log.debug('creating downloadDir');
        this.createFolder(config.downloadDir);
    }

    setIpcEvents() {
        this.setProcessEvent();
        this.setNextItemLoadEvent();
        this.setNextItemDownloadEvent();
    }

    startLoadPlaylistItem() {
        log.debug('---startLoadPlaylistItem---');
        ipcMain.on('start-load-playlist-item', (event: any, item: Item) => {
            this.loadListItem(item);
        })
    }

    setNextItemDownloadEvent() {
        log.debug('---setNextItemDownloadEvent-----');
        ipcMain.on('download-playlist-item', (event: any, item: Item) => {
            log.debug('---in ipcMain download-playlist-item----');
            this.downloadPlaylistItem(item);
        });
    }

    setStartSingleVideoDownloadEvent() {
        ipcMain.on('start-single-video-download', (event: any, item: Item) => {
            console.log('---start-single-video-download---');
            this.processForDownload(item);
        })
    }

    setNextItemLoadEvent() {
        ipcMain.on('load-playlist-item', (event: any, item: Item) => {
            //this.loadListItem(item);
            let url = this.url.getUrlFromId(JSON.parse(item.list[item.loadIndex]).id);
            this.loadInfo(url, item);
        });
    }

    setProcessEvent() {
        ipcMain.on('start-process', (event: any, url: string) => {
            this.startProcess(url);
        });
    }

    startProcess(url: string) {
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

    async loadInfo(url: string, item: Item) {

        console.log('----------loadInfo-------------');
        console.log(url);
        let loadedInfo:VideoInfo;
        try {
            loadedInfo = <VideoInfo>await this.infoManager.getVideoInfo(this.url.getIdFromUrl(url));
        } catch (err) {
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

    processForDownload(item: Item) {
        log.debug('----processForDownload---');
        if (this.numberOfItemInProgress < 6) {
            if (item.isPlaylist) this.downloadPlaylist(item);
            else this.downloadSingleVideo(item);
        }
        else this.queue.push(item);
    }

    async downloadSingleVideo(item: Item) {
        log.debug('----downloadSingleVideo------');
        var size = item.infoAtLoad.filesize;
        let video =<youtubedl.Youtubedl> await this.downloadVideo(item.url, item);
        var pos = 0;
        var progressInfo: progressInfo = {id:item.id,percent:0};
        var percent = 0;
        progressInfo.id = item.id;
        video.on('data', function data(chunk: any) {
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
                function (message:any) {
                    log.debug(message);
                });
        });
    }

   private async downloadPlaylist(item: Item) {
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

   private async loadListItem(item: Item) {
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

   private downloadListItem(item: Item) {
        console.log('----downloadListItem-----');
        item.downloadIndex++;
        if (item.downloadIndex < item.list.length) {
            this.win.webContents.send('check-load-of-playlist-item', item);

        }

    }

   private writeInfoToFile(loadedInfo: any) {
        var jsonContent = JSON.stringify(loadedInfo);
        fs.writeFile("output.json", jsonContent, 'utf8', function (err) {
            if (err) {
                console.log("An error occured while writing JSON Object to File.");
                return console.log(err);
            }

            console.log("JSON file has been saved.");
        });
    }

    private download_videoList(item: Item) {

        log.debug('------download_videoList--------');
        var url = item.url;
        youtubedl.exec(url, ['-j', '--flat-playlist'], {}, (err: any, output: string[]) => {
            if (err) throw err;
            item.list = output;
            this.win.webContents.send('list-downloaded', item);
            this.downloadPlaylist(item);

        });
    }

    private async downloadPlaylistItem(item:Item) {

        log.debug('----downloadPlaylistItem------');
        //var size = item.infoAtDownload.filesize;
        var id = JSON.parse(item.list[item.downloadIndex]).id;
        var url = this.url.getUrlFromId(id);
        let video = <youtubedl.Youtubedl> await this.downloadVideo(url, item);
        var size = item.infoAtDownload.filesize;
        var pos = 0;
        var progressInfo:progressInfo;
        var percent = 0;
        progressInfo.id = item.infoAtDownload.id;
        video.on('data', function data(chunk:any) {
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
                function (message:any) {
                    log.debug(message);
                });
            this.downloadListItem(item);

        });

    }

    createFolder(dir:string) {
        log.debug('---createFolder----');
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
    }

   private downloadVideo(url:string, item:Item) {
        log.debug('------downloadVideo-------');
        return new Promise((resolve) => {


            var video = youtubedl(url,
                ['--format=18'],
                <any>{ cwd: __dirname, maxBuffer: Infinity, timeout:15000 });

            video.on('info', (loadedInfo:any) => {
                item.infoAtDownload = <VideoInfo>loadedInfo;
                let downloadPath = path.join(config.downloadDir, loadedInfo._filename);
                video.pipe(fs.createWriteStream(downloadPath));
                resolve(video);
            });

        }).catch(error => {
            log.debug('error in downloadVideo:' + error.message);
        });

    }

    private getDateTime():string {
        var date = new Date();
        var time = date.getHours() + "_" + date.getMinutes() + "_" + date.getSeconds();
        var str_date = date.getFullYear() + '.' + (date.getMonth() + 1) + '.' + date.getDate();
        return time + " " + str_date;
    }
}

