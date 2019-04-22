
const { ipcMain, shell } = require('electron');
const Url = require('./Url');
const youtubedl = require('youtube-dl');
const fs = require('fs');
const path = require('path');

module.exports = class FileManager {
    constructor(app, win) {
        this.app = app;
        this.win = win;
        this.setIpcEvents();
    }

    move(oldPath, newPath, info, callback) {
        console.log("new path:");
        console.log(newPath);
        var dir = newPath.substr(0, newPath.lastIndexOf(path.sep));
        console.log("last index:" + newPath.lastIndexOf(path.sep));
        console.log("new path:" + dir);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }

        fs.rename(oldPath, newPath, function (err) {
            if (err) {
                if (err.code === 'EXDEV') {
                    copy();
                    this.win.webContents.send('move-complete', info);
                } else {
                    callback(err);
                }
                return;
            }
            else {
                this.win.webContents.send('move-complete', info);
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
        this.onDownloadComplete();
        this.onShowDownloads();
    }

    onDownloadComplete() {
        ipcMain.on('download-complete', (event, info) => {
            this.move(info.downloadFilePath, path.join(this.app.getPath('videos'), "kr_youtube_downloader", info._filename), info, (err) => {
                console.log(err);
            });
        });
    }

    onShowDownloads() {
        ipcMain.on('open_file_directory', function (event, info) {
            var downloadedFile_path = path.join(this.app.getPath('videos'), "kr_youtube_downloader", info._filename);
            console.log("downloaded file path:" + downloadedFile_path);
            //shell.showItemInFolder(app.getPath('videos')+"/myDownloader/"+"\""+downloadFileName+"\"");
            shell.showItemInFolder(downloadedFile_path);
        });
    }

}