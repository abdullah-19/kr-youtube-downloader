"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
class Main {
    constructor() {
        this.downloadBtn = document.getElementById('downloadBtn');
        this.urlField = document.getElementById('urlField');
        this.status_text = document.getElementById('error_text');
        this.urlManager = new UrlManager();
        this.init();
    }
    init() {
        this.downloadBtn.addEventListener('click', () => {
            this.start_process();
        });
    }
    start_process() {
        let guiManager = new GuiManager();
        console.log('--start_process----');
        let url = this.urlField.value;
        if (url == "") {
            this.status_text.innerHTML = "Please insert url";
        }
        else if (this.urlManager.isValidUrl(url)) {
            if (this.urlManager.isPlaylist(url)) {
                let id = this.urlManager.getPlaylistId(url);
                if (document.getElementById('playlist_' + id)) {
                    let elem = document.getElementById('playlist_' + id);
                    if (!elem.classList.contains('inProgress')) {
                        elem.parentNode.removeChild(elem);
                        guiManager.showPlaylistWaitingDiv(url);
                        electron_1.ipcRenderer.send('start-process', url);
                    }
                }
                else {
                    guiManager.showPlaylistWaitingDiv(url);
                    electron_1.ipcRenderer.send('start-process', url);
                }
            }
            else {
                //let id = extractId(url);
                let id = this.urlManager.getIdFromUrl(url);
                if (!document.getElementById('singleWaiting_' + id)) {
                    guiManager.showSingleVideoWaitingDiv(id);
                    electron_1.ipcRenderer.send('start-process', url);
                }
            }
        }
        else {
            this.status_text.innerHTML = "Url is not valid";
        }
        console.log("Url:" + url);
    }
}
