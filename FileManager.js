
const { ipcMain, shell } = require('electron');
const Url = require('./Url');
const log = require('./Logger');
const youtubedl = require('youtube-dl');
const fs = require('fs');
const path = require('path');

module.exports = class FileManager {
    constructor(app, win) {
        this.app = app;
        this.win = win;
        this.setIpcEvents();
    }

    move(oldPath, newPath, item, callback) {
        log.debug("new path:");
        log.debug(newPath);
        var dir = newPath.substr(0, newPath.lastIndexOf(path.sep));
        log.debug("last index:" + newPath.lastIndexOf(path.sep));
        log.debug("new path:" + dir);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }

        fs.rename(oldPath, newPath, (err) =>{
            if (err) {
                if (err.code === 'EXDEV') {
                    copy();
                   // this.win.webContents.send('move-complete', item);
                   this.win.webContents.send('download-complete', item);
                } else {
                    callback(err);
                }
                return;
            }
            else {
                //this.win.webContents.send('move-complete', item);
                this.win.webContents.send('download-complete', item);
            }
        });

        function copy() {
            var readStream = fs.createReadStream(oldPath);
            var writeStream = fs.createWriteStream(newPath);

            readStream.on('error', callback);
            writeStream.on('error', callback);

            readStream.on('close', function () {
                fs.unlink(oldPath, callback);
            });
            readStream.pipe(writeStream);
        }
    }


    setIpcEvents() {
        //this.onDownloadComplete();
        this.onShowDownloads();
    }

    // onDownloadComplete() {
    //     ipcMain.on('download-complete', (event, info) => {
    //         var movePath;
    //         if(info.type === "playlist") movePath = path.join(this.app.getPath('videos'), "kr_youtube_downloader",info.folderName, info.loadedInfo
    //         ._filename);
    //         else movePath = path.join(this.app.getPath('videos'), "kr_youtube_downloader", info.loadedInfo._filename);
    //         this.move(info.loadedInfo.downloadFilePath, movePath, info, (err) => {
    //             console.log(err);
    //         });
    //     });
    // }

    onShowDownloads() {
        ipcMain.on('open-file-directory', (event, item) =>{
            log.debug('----ipcMain open-file-directory----');
            var destinationPath;
            destinationPath = path.join(item.destinationDir,item.infoAtDownload._filename);
            log.debug("downloaded file path:" + destinationPath);
            shell.showItemInFolder(destinationPath);
        });

        ipcMain.on('open-already-downloaded-file-directory', (event, item) =>{
            log.debug('----ipcMain open-already-downloaded-file-directory----');
            var destinationPath;
            destinationPath = path.join(item.destinationDir,item.infoAtLoad._filename);
            log.debug("downloaded file path:" + destinationPath);
            shell.showItemInFolder(destinationPath);
        });
    }

}