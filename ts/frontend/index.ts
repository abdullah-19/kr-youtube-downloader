import { ipcRenderer } from "electron";
import { GuiManager } from "./GuiManager";
import { UrlManager } from "./UrlManager";

class Main {
    private readonly downloadBtn: HTMLElement = document.getElementById('downloadBtn');

    private readonly urlField: HTMLInputElement =
        <HTMLInputElement>document.getElementById('urlField');

    private readonly status_text:HTMLElement = document.getElementById('error_text');
    
    private readonly urlManager:UrlManager = new UrlManager();

    constructor() {
        this.init();
    }

    private init(): void {
        console.log('initialised');
        this.downloadBtn.addEventListener('click', () => {
            this.start_process();
        });
    }

    private start_process(): void {
        let guiManager = new GuiManager();
        console.log('--start_process----');
        let url: string = this.urlField.value;

        if (url == "") {
            this.status_text.innerHTML = "Please insert url";
        }

        else if (this.urlManager.isValidUrl(url)) {
            if (this.urlManager.isPlaylist(url)) {
                let id:string = this.urlManager.getPlaylistId(url);
                if (document.getElementById('playlist_' + id)) {
                    let elem:HTMLElement = <HTMLElement>document.getElementById('playlist_' + id);
                    if (!elem.classList.contains('inProgress')) {
                        elem.parentNode.removeChild(elem);
                        guiManager.showPlaylistWaitingDiv(url);
                        ipcRenderer.send('start-process', url);
                    }
                }
                else {
                    guiManager.showPlaylistWaitingDiv(url);
                    ipcRenderer.send('start-process', url);
                }

            }
            else {
                //let id = extractId(url);
                let id = this.urlManager.getIdFromUrl(url);
                if (!document.getElementById('singleWaiting_' + id)) {
                    guiManager.showSingleVideoWaitingDiv(id);
                    ipcRenderer.send('start-process', url);
                }
            }

        }

        else {
            this.status_text.innerHTML = "Url is not valid";
        }

        console.log("Url:" + url);
    }

}

new Main();