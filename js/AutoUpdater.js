const log = require('./Logger');
const { autoUpdater } = require("electron-updater");


module.exports = class AutoUpdater {
    /**
     * @param {Electron.App} app
     * @param {typeof Electron.Menu} menu
     */
    constructor(app) {

        autoUpdater.logger = log;
        autoUpdater.logger.transports.file.level = 'info';
        log.info('App starting...');

        this._app = app;

        this.runForMac();
        this.configureUpdater();

    }

    configureUpdater() {
        autoUpdater.on('checking-for-update', () => {
            //sendStatusToWindow('Checking for update...');
            console.log('Checking for update...');
        })
        autoUpdater.on('update-available', (ev, info) => {
            //sendStatusToWindow('Update available.');
            console.log('Update available.');
        })
        autoUpdater.on('update-not-available', (ev, info) => {
            //sendStatusToWindow('Update not available.');
            console.log('Update not available.');
        })
        autoUpdater.on('error', (ev, err) => {
            //sendStatusToWindow('Error in auto-updater.');
            console.log('Error in auto-updater.');
        })
        autoUpdater.on('download-progress', (ev, progressObj) => {
            //sendStatusToWindow('Download progress...');
            console.log('Download progress...');
        })

        autoUpdater.on('update-downloaded', (ev, info) => {
            setTimeout(function () {
                autoUpdater.quitAndInstall();
            }, 5000)
        })
    }

    checkForUpdate() {
        autoUpdater.checkForUpdates();
    }

    runForMac() {
        let template = []
        if (process.platform === 'darwin') {
            // OS X
            const name = this._app.getName();
            template.unshift({
                label: name,
                submenu: [
                    {
                        label: 'About ' + name,
                        role: 'about'
                    },
                    {
                        label: 'Quit',
                        accelerator: 'Command+Q',
                        click() { this._app.quit(); }
                    },
                ]
            })
        }

    }
}