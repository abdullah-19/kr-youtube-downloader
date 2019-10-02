import { app, BrowserWindow } from "electron";
import config from "./config";
import { AutoUpdater } from "./AutoUpdater";
import url = require("url");
import log from "./Logger";
import { DownloadManager } from "./DownloadManager";
import { FileManager } from "./FileManager";

export class MainApp {
    private win: BrowserWindow;
    private downloader: DownloadManager;
    private fileManager: FileManager;
    constructor() {
        this.onReady();
        this.setAppEvents();
    }

    private setAppEvents() {

        this.closeEvent();
        this.activateEvent();

    }

    private closeEvent() {
        app.on('window-all-closed', () => {

            if (process.platform !== 'darwin') {
                if (this.win === null) console.log("win value = null");
                app.quit();
            }
        });
    }

    activateEvent() {
        app.on('activate', () => {
            if (this.win === null) {
                this.createWindow();
            }
        });
    }

    onReady() {
        app.on('ready', () => {
            this.createWindow();
            if (config.isProduction) {
                new AutoUpdater().checkForUpdate();
            }
            //new Downloader(this.app,this.win);
            //checkUpdate();
        });
    }

    createWindow() {
        this.win = new BrowserWindow({ width: 800, height: 600, webPreferences: { nodeIntegration: true } });

        this.win.loadURL(url.format({
            pathname: config.htmlPath,
            protocol: 'file:',
            slashes: true
        }));

        this.win.on('closed', () => {
            this.win = null
        });
        log.debug('window created');
        this.downloader = new DownloadManager(this.win);
        this.fileManager = new FileManager(this.win);
        log.debug('downloader object created.')
    }
}