import log from './Logger';
import {autoUpdater} from "electron-updater";
import {app} from "electron";

export class AutoUpdater{
    constructor(){
        autoUpdater.logger = log;
        //autoUpdater.logger.transports.file.level = 'info';
        log.info('App starting...');

        this.runForMac();
        this.configureUpdater();
    }

    private configureUpdater():void{
        
        autoUpdater.on('checking-for-update', () => {
            //sendStatusToWindow('Checking for update...');
            log.info('Checking for update...');
        })
        autoUpdater.on('update-available', (ev, info) => {
            //sendStatusToWindow('Update available.');
            log.info('Update available.');
        })
        autoUpdater.on('update-not-available', (ev, info) => {
            //sendStatusToWindow('Update not available.');
            log.info('Update not available.');
        })
        autoUpdater.on('error', (ev, err) => {
            //sendStatusToWindow('Error in auto-updater.');
            log.info('Error in auto-updater.');
        })
        autoUpdater.on('download-progress', (ev, progressObj) => {
            //sendStatusToWindow('Download progress...');
            log.info('Download progress...');
        })

        autoUpdater.on('update-downloaded', (ev, info) => {
            setTimeout(function () {
                autoUpdater.quitAndInstall();
            }, 5000)
        })
    
    }

    public  checkForUpdate():void {
        autoUpdater.checkForUpdates();
    }

    private runForMac() {
        let template = [];
        if (process.platform === 'darwin') {
            // OS X
            const name = app.getName();
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
                        click() { app.quit(); }
                    },
                ]
            })
        }

    }
}