import { BrowserWindow } from "electron";
import { VideoInfo } from "./Item";
import log from "./Logger";
import youtubedl = require('youtube-dl');


export class InfoManager {
    private win: BrowserWindow;
    constructor(win: BrowserWindow) {
        this.win = win;
    }

    public getVideoInfo(url: string) {
        log.debug('------getVideoInfo-------');

        return new Promise((resolve) => {

            var video = youtubedl(url,
                ['--format=18'],
                <any>{ cwd: __dirname, maxBuffer: Infinity, timeout: 25000 });

            video.on('info', (loadedInfo: VideoInfo) => {
                console.log('info resolved');
                console.log(loadedInfo);
                resolve(loadedInfo);
            });

        }).catch((error) => {
            log.error('error test:');
            log.error('Error from getVideoinfo with async( When promise gets rejected ): ' + error);
        });
    }

}