"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
class DownloadManager {
    constructor() {
        this.setIpcEvents();
    }
    setIpcEvents() {
        console.log('--setIpcEvents--');
        let urlManager = new UrlManager();
        electron_1.ipcRenderer.on('load-complete', function (event, item) {
            console.log('--------in ipcRenderer load-complete--------------');
            console.log(item);
            console.log('video type:');
            console.log(item.isPlaylist);
            if (item.isPlaylist) {
                console.log('getPlaylistLoadItemId(item)');
                console.log(urlManager.getPlaylistLoadItemId(item));
                console.log('item.loadIndex:');
                console.log(item.loadIndex);
                console.log('playlist load item id:');
                console.log(urlManager.getPlaylistLoadItemId(item));
                let elem = document.getElementById("pi_" + urlManager.getPlaylistLoadItemId(item));
                if (!elem) {
                    console.log('element not created');
                    return;
                }
                if (elem.classList.contains('waiting')) {
                    //  showPlaylistItemInfo(item);
                }
            }
            else {
                if (document.getElementById('singleAlreadyDone_' + item.id)) {
                    let elem = document.getElementById('singleAlreadyDone_' + item.id);
                    elem.parentNode.removeChild(elem);
                }
                // showSingleVideoInfo(item);
                electron_1.ipcRenderer.send('start-single-video-download', item);
            }
        });
    }
    setLoadCompleteEvent() {
    }
}
