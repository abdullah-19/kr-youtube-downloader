const {BrowserWindow, ipcMain, shell } = require('electron');
const Downloader = require('./Downloader');
const config = require('./config');
const log = require('./Logger');

const AutoUpdater = require('./AutoUpdater');
const Info = require('./Info');
const FileManager = require('./FileManager');
const path = require('path')
const url = require('url')
const exec = require('child_process').exec;
const fetchVideoInfo = require('youtube-info');
const fs = require('fs');


module.exports = class MainApp {
    constructor(app) {
        this.app = app;

        this.onReady();
        //this.downloader = new Downloader(this.app,this.win);
        //this.info = new Info();
        this.setAppEvents();
    }


    setAppEvents() {
        this.app.on('window-all-closed', () => {

            if (process.platform !== 'darwin') {
                if (this.win === null) console.log("win value = null");
                this.app.quit();
            }
        });

        this.app.on('activate', () => {
            if (this.win === null) {
                createWindow();
            }
        });

    }

    onReady() {
        this.app.on('ready', () => {
            this.createWindow();
            if(config.isProduction){
                new AutoUpdater().checkForUpdate();
            }
            //new Downloader(this.app,this.win);
            //checkUpdate();
        });
    }

    createWindow() {
        this.win = new BrowserWindow({ width: 800, height: 600 });
        

        this.win.loadURL(url.format({
            pathname: path.join(__dirname, 'web/index.html'),
            protocol: 'file:',
            slashes: true
        }));

        this.win.on('closed', () => {
            this.win = null
        });
        log.debug('window created');
        this.downloader = new Downloader(this.app,this.win);
        this.FileManager = new FileManager(this.app,this.win);
        log.debug('downloader object created.')
    }
}

