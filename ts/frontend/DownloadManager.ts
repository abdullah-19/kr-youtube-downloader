import { ipcRenderer } from "electron";
import { Item } from "./Item";
import { UrlManager } from "./UrlManager";
import { GuiManager } from "./GuiManager";

export class DownloadManager {
    private readonly urlManager: UrlManager = new UrlManager();
    private readonly guiManager: GuiManager = new GuiManager();
    constructor() {
        this.setIpcEvents();
    }

    private setIpcEvents(): void {
        console.log('--setIpcEvents--');
        this.setLoadCompleteEvent();
        this.setDownloadStartedEvent();
        this.setListDownloadedEvent();
        this.setDownloadingPlaylistEvent();

    }

    private setLoadCompleteEvent(): void {
        console.log('----setLoadCompleteEvent----');
        ipcRenderer.on('load-complete', (event: any, item: Item) => {
            console.log('--------in ipcRenderer load-complete--------------');
            console.log(item);
            console.log('video type:');
            console.log(item.isPlaylist);
            if (item.isPlaylist) {
                console.log('getPlaylistLoadItemId(item)');
                console.log(this.urlManager.getPlaylistLoadItemId(item));
                console.log('item.loadIndex:');
                console.log(item.loadIndex);
                console.log('playlist load item id:');
                console.log(this.urlManager.getPlaylistLoadItemId(item));
                let elem = document.getElementById("pi_" + this.urlManager.getPlaylistLoadItemId(item));
                if (!elem) {
                    console.log('element not created');
                    return;
                }
                if (elem.classList.contains('waiting')) {
                    this.guiManager.showPlaylistItemInfo(item);
                }
            }
            else {
                if (document.getElementById('singleAlreadyDone_' + item.id)) {
                    let elem = document.getElementById('singleAlreadyDone_' + item.id);
                    elem.parentNode.removeChild(elem);
                }
                this.guiManager.showSingleVideoInfo(item);
                ipcRenderer.send('start-single-video-download', item);
            }

        });
    }

    private setDownloadStartedEvent(): void {
        ipcRenderer.on('download-started', (event: any, item: Item) => {
            console.log('---ipcRenderer download-started-------');
            console.log('item:');
            console.log(item);

            if (item.isPlaylist) {
                this.guiManager.showProgressOfPlaylistVideo(item);
            }
            else {
                document.getElementById('pds_' + item.id).classList.remove('d-none');
            }
        });
    }

    private setListDownloadedEvent(): void {
        ipcRenderer.on('list-downloaded', function (event: any, item: Item) {
            console.log('---ipcRenderer list-downloaded----');
            let playlistDiv = document.getElementById('playlist_' + item.id);
            playlistDiv.getElementsByClassName('p_title')[0].innerHTML = item.folderName;

        });
    }

    private setDownloadingPlaylistEvent(): void {
        ipcRenderer.on('downloading-playlist', (event: any, item: Item) => {
            console.log('-------downloading-playlist---------');
            console.log(item);
            let playlistDiv = document.getElementById('playlist_' + item.id);
            playlistDiv.getElementsByClassName('waitngIconOfPlaylist')[0].classList.add('d-none');

            let status = playlistDiv.getElementsByClassName('playlistDownloadStatus')[0];
            status.innerHTML = "starting download...";
            status.classList.remove('d-none');

            playlistDiv.getElementsByClassName('collapse')[0].classList.add('show');
            item.loadIndex++;
            this.guiManager.showPlaylistItemWaitingDiv(item);

        });
    }

    private setCheckingLoadOfPlaylistItem() {
        ipcRenderer.on('check-load-of-playlist-item', (event: any, item: Item) => {
            console.log('-----check-load-of-playlist-item-----');
            this.checkLoadOfPlaylistItem(item);
        });

    }

    private checkLoadOfPlaylistItem(item: Item): void {
        let waitingTime = 0;
        (function me(classT:DownloadManager) {
            waitingTime++;

            let id = JSON.parse(item.list[item.downloadIndex]).id;
            console.log(id);
            let elem = document.getElementById('pi_' + id);

            console.log('item.downloadIndex:');
            console.log(item.downloadIndex);

            if (elem.classList.contains('done')) {

                console.log('already has been downloaded');
                return;
            }

            if (elem.classList.contains('skipped')) {
                item.downloadIndex++;
                waitingTime = 0;
                me(classT);
                return;
            }

            if (waitingTime > 20) {
                console.log('waiting time for load exeeded, so skipping');
                item.downloadIndex++;
                waitingTime = 0;
                me(classT);
                return;
            }

            if (!elem) {
                console.log('playlist waiting div not created, download index:' + item.downloadIndex);
                setTimeout(me, 1000);
                return;
            }
            if (!elem.classList.contains('pending')) {
                console.log('playlist item not in pending, download index:' + item.downloadIndex);
                setTimeout(me, 1000);
                return;
            }
            console.log('playlist item info exist');
            elem.classList.remove('pending');
            elem.classList.add('starting');
            ipcRenderer.send('download-playlist-item', item);
            classT.checkForDownloadStart(item);

        })(this);
    }

    private checkForDownloadStart(item:Item):void {
        console.log('---checkForDonloadStart---');
        let id = JSON.parse(item.list[item.downloadIndex]).id;
        console.log('download id:' + id);
        let elem = document.getElementById('pi_' + id);
        let trial = 0;
        let f = setInterval(() => {
            if (elem.classList.contains('starting')) {
                console.log('trying again to download');
                trial++;
                if (trial > 2) {
                    console.log('max trail exeeded to download');
                    clearInterval(f);
                    return;
                }
                ipcRenderer.send('download-playlist-item', item);
                // checkForDownloadStart(item);
                return;
            }
            else clearInterval(f);
        }, 25 * 1000);

        setTimeout(() => {
            if (elem.classList.contains('starting')) {
                console.log('forwarding to next download');
                if (item.downloadIndex + 1 < item.list.length) {
                    let copyItem = { ...item };
                    copyItem.downloadIndex++;
                    this.checkLoadOfPlaylistItem(copyItem);
                }
                //ipcRenderer.send('download-playlist-item', copyItem);
            }
        }, 15 * 1000);

    }

}