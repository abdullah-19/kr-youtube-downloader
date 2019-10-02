import { BrowserWindow, ipcMain, shell } from "electron";
import { Item } from "./Item";
import log from "./Logger";
import fs = require("fs");
import path = require("path");

export class FileManager{
    private win:BrowserWindow;
    constructor(win:BrowserWindow){
        this.win = win;
        this.setIpcEvents();
    }

   public move(oldPath:string, newPath:string, item:Item, callback:any):void {
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

    private setIpcEvents():void {
        //this.onDownloadComplete();
        this.onShowDownloads();
    }

    private onShowDownloads():void {
        ipcMain.on('open-file-directory', (event:any, item:Item) =>{
            log.debug('----ipcMain open-file-directory----');
            var destinationPath;
            destinationPath = path.join(item.destinationDir,item.infoAtDownload._filename);
            log.debug("downloaded file path:" + destinationPath);
            shell.showItemInFolder(destinationPath);
        });

        ipcMain.on('open-already-downloaded-file-directory', (event:any, item:Item) =>{
            log.debug('----ipcMain open-already-downloaded-file-directory----');
            var destinationPath;
            destinationPath = path.join(item.destinationDir,item.infoAtLoad._filename);
            log.debug("downloaded file path:" + destinationPath);
            shell.showItemInFolder(destinationPath);
        });
    }
}