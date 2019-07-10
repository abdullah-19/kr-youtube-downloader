import { ipcRenderer, EventEmitter } from "electron";
class GuiManager {
    private readonly status_text: HTMLElement = document.getElementById('error_text');
    constructor() {
        this.setIpcEvents();
    }

    private setIpcEvents(): void {
        this.setMoveCompleteEvent();
        this.setDownloadProgressEvent();
        this.setPlaylistDownloadProgressEvent();
        this.setDownloadCompleteEvent();
        this.setAlreadyDownloadingEvent();
        this.setAlreadyDownloadedEvent();
        this.setAlreadyDownloadedingEvent();

    }

    private setMoveCompleteEvent(): void {
        // ipcRenderer.on('move-complete', (event, info:Item) => {
        //     let arg = info.infoAtLoad;
        //     console.log('move completed');
        //     document.getElementById('downloadingIcon_' + arg.id).style.display = "none";
        //     document.getElementById('folderIcon_' + arg.id).style.display = "inline-block";
        // });
    }

    private setDownloadProgressEvent(): void {
        ipcRenderer.on('download-progress', function (event: any, progressInfo: ProgressInfo) {
            document.getElementById('pbs_' + progressInfo.id).style.width = progressInfo.percent + "%";
            document.getElementById('pts_' + progressInfo.id).innerHTML = progressInfo.percent + "%";

        });

    }

    private setDownloadCompleteEvent() {
        ipcRenderer.on('download-complete', (event: any, item: Item) => {
            console.log('----ipcRenderer download-complete---');
            var iconDiv: HTMLElement;
            if (item.isPlaylist) {
                console.log('id:' + item.infoAtDownload.id);
                iconDiv = document.getElementById('pi_' + item.infoAtDownload.id);
            }
            else {
                iconDiv = document.getElementById('s_' + item.id);
            }

            iconDiv.classList.remove('downloading');
            iconDiv.classList.add('done');
            let folderIcon: HTMLElement = <HTMLElement>iconDiv.getElementsByClassName('folderIcon')[0];
            folderIcon.classList.remove('d-none');

            var progressDiv = iconDiv.getElementsByClassName('progress_div')[0];
            progressDiv.classList.add('d-none');

            folderIcon.onclick = function () {
                ipcRenderer.send('open-file-directory', item);
            }

        });
    }

    private setPlaylistDownloadProgressEvent(): void {

        ipcRenderer.on('playlist-download-progress', function (event: any, progressInfo: ProgressInfo) {

            console.log('--------ipcRenderer playlist-download-progress--------------');
            console.log("progressInfo:");
            console.log(progressInfo);
            console.log('progressInfo.id:' + progressInfo.id);
            console.log('progressInfo.percent:' + progressInfo.percent);

            document.getElementById('pbp_' + progressInfo.id).style.width = progressInfo.percent + "%";
            document.getElementById('ptp_' + progressInfo.id).innerHTML = progressInfo.percent + "%";

        });
    }

    private setAlreadyDownloadingEvent():void {
        ipcRenderer.on('already-downloading', (event:any, item:Item) => {
            console.log('-----ipcRenderer already-downloading--------');
            if (item.isPlaylist) {
                let playlistItem = document.getElementById('pi_' + item.playlistId);
                let status = playlistItem.getElementsByClassName('ai_progress')[0];
                let processIcon = playlistItem.getElementsByClassName('processIcon')[0];
                processIcon.classList.add('d-none');
                status.classList.remove('d-none');

            }
            else {
                let playlistItem = document.getElementById('s_' + item.playlistId);
                let status = playlistItem.getElementsByClassName('ai_progress')[0];
                let processIcon = playlistItem.getElementsByClassName('processIcon')[0];
                processIcon.classList.add('d-none');
                status.classList.remove('d-none');
            }
        });
    }

    private setAlreadyDownloadedEvent():void{
        ipcRenderer.on('already-downloaded', (event:any, item:Item) => {

            console.log('-----ipcRenderer already-downloaded--------');
            if (item.isPlaylist) {
                let playlistItem = document.getElementsByClassName('')[0];
                let status = playlistItem.getElementsByClassName('a_done')[0];
                let processIcon = playlistItem.getElementsByClassName('processIcon')[0];
                processIcon.classList.add('d-none');
                status.classList.remove('d-none');
        
            }
            else {
                this.showAlreadyDownloadedSingleVideoInfo(item);
            }
        });
    }

    private setAlreadyDownloadedingEvent():void{
        ipcRenderer.on('already-downloadeding', function (event:any, item:Item) {
            if (item.isPlaylist) {
        
            }
            else {
                let element = document.getElementById('singleWaiting_' + item.id);
                element.parentNode.removeChild(element);
                document.getElementById('s_' + item.id).scrollIntoView();
            }
        });
    }


    public clear_status(): void {
        this.status_text.innerHTML = "";
        let downloadBtn: HTMLElement = document.getElementById('downloadBtn');
        if (downloadBtn.style.display == "none") {
            downloadBtn.style.display = "inline-block";
            document.getElementById('processIcon').style.display = "none";
        }
    }

    public showSingleVideoWaitingDiv(id: string): void {
        console.log('----showSingleVideoWaitingDiv-----');
        let waitingDiv: HTMLElement = <HTMLElement>document.querySelector('#singleWaitingDemo').cloneNode(true);
        waitingDiv.id = 'singleWaiting_' + id;
        waitingDiv.classList.remove("d-none");
        var sibling = document.getElementById('singleWaitingDemo');
        sibling.parentNode.insertBefore(waitingDiv, sibling.nextSibling);
    }


    public showSingleVideoInfo(item: Item) {
        console.log('----showSingleVideoInfo----');
        var info: VideoInfo = item.infoAtLoad;

        var infoDiv: HTMLElement = document.getElementById('singleWaiting_' + item.id);
        if (document.getElementById('s_' + item.id)) {
            let ele = document.getElementById('s_' + item.id);
            ele.parentNode.removeChild(ele);
        }

        infoDiv.id = 's_' + item.id;

        (<HTMLImageElement>infoDiv.getElementsByClassName('thumbnail')[0]).src = item.infoAtLoad.thumbnail;

        let filesize: HTMLElement = <HTMLElement>infoDiv.getElementsByClassName('filesize')[0];
        filesize.innerHTML = "Filesize:" + (info.filesize / 1024) + "MB";
        filesize.classList.remove('d-none');

        let duration: HTMLElement = <HTMLElement>infoDiv.getElementsByClassName('duration')[0];
        duration.innerHTML = "Duration:" + info._duration_hms;
        duration.classList.remove('d-none');

        var filename: HTMLElement = <HTMLElement>infoDiv.getElementsByClassName('filename')[0];
        filename.innerHTML = "Filename:" + info._filename;
        filename.classList.remove('d-none');

        infoDiv.getElementsByClassName('progress_div')[0].id = "pds_" + item.id;
        infoDiv.getElementsByClassName('progress_bar')[0].id = "pbs_" + item.id;
        infoDiv.getElementsByClassName('progress_text')[0].id = "pts_" + item.id;

        filename.innerHTML = "filename:" + info._filename;
        filename.classList.remove('d-none');

        infoDiv.getElementsByClassName('processIcon')[0].classList.add('d-none');

    }

    public showPlaylistWaitingDiv(url: string): void {
        console.log('----showPlaylistWaitingDiv-----');
        let urlManager = new UrlManager();
        let id: string = urlManager.getPlaylistId(url);
        let waitingDiv: HTMLElement = <HTMLElement>document.querySelector('#playlist_demo').cloneNode(true);
        console.log(waitingDiv);
        waitingDiv.id = "playlist_" + id;
        waitingDiv.classList.remove("d-none");
        let sibling: HTMLElement = document.getElementById('playlist_demo');
        sibling.parentNode.insertBefore(waitingDiv, sibling.nextSibling);

        let playlistItemDemo: HTMLElement = <HTMLElement>waitingDiv.getElementsByClassName('playlistItem')[0];
        console.log('playlist item demo:');
        playlistItemDemo.id = "piDemo_" + id;
        console.log(playlistItemDemo);

    }

    public showPlaylistItemWaitingDiv(item: Item): void {
        console.log('-----showPlaylistItemWaitingDiv------');
        //var playlistDiv = document.getElementById('playlist_'+item.id);
        let waitingItemDiv: HTMLElement = <HTMLElement>document.querySelector('#piDemo_' + item.id).cloneNode(true);
        console.log('loadIndex:' + item.loadIndex);
        let id: string = JSON.parse(item.list[item.loadIndex]).id;
        console.log('id:' + id);
        //var waitingItemDiv = playlistDiv.getElementsByClassName('playlistItem');
        waitingItemDiv.id = "pi_" + id;
        waitingItemDiv.classList.remove("d-none");
        var sibling: HTMLElement = document.getElementById('piDemo_' + item.id);
        console.log('sibling:');
        console.log(sibling);
        //sibling.parentNode.insertBefore(waitingItemDiv, sibling.nextSibling);
        sibling.parentNode.appendChild(waitingItemDiv);

        waitingItemDiv.getElementsByClassName('progress_bar')[0].id = 'pbp_' + id;
        waitingItemDiv.getElementsByClassName('progress_text')[0].id = 'ptp_' + id;

        ipcRenderer.send('load-playlist-item', item);
        this.checkForLoadComplete(item);

    }

    public checkForLoadComplete(item: Item): void {
        //item.loadIndex++;
        console.log('---checkingForLoadComplete---');
        let id: string = JSON.parse(item.list[item.loadIndex]).id;
        let trial: number = 1;
        let elem: HTMLElement = document.getElementById('pi_' + id);
        let f = setInterval(() => {
            if (elem.classList.contains('waiting')) {
                console.log('trying again to load');
                console.log('id:' + id);
                trial++;
                console.log('trial:' + trial);
                if (trial <= 3) {
                    ipcRenderer.send('load-playlist-item', item);
                }
                else {
                    //elem.classList.add('cancelled');
                    //elem.classList.remove('waiting');
                    elem.classList.add('skipped');
                    elem.classList.remove('waiting');
                    console.log('max trial exeeded, cant load the video info');
                    clearInterval(f);
                }
            }
            else clearInterval(f);
        }, 20 * 1000);

        setTimeout(() => {
            if (elem.classList.contains('waiting')) {

                if (item.loadIndex + 1 < item.list.length) {
                    console.log('going forward for delay');
                    let copyItem = { ...item };
                    copyItem.loadIndex++;
                    this.showPlaylistItemWaitingDiv(copyItem);
                }
            }
        }, 15 * 1000);
    }


    public showPlaylistItemInfo(item: Item): void {

        console.log('------showPlaylistItemInfo------');
        console.log(item);
        let playlistItemDiv: HTMLElement = document.getElementById('pi_' + item.infoAtLoad.id);
        console.log('pi_' + item.infoAtLoad.id);
        console.log(playlistItemDiv);

        playlistItemDiv.classList.remove('waiting');
        playlistItemDiv.classList.add('pending');
        playlistItemDiv.getElementsByClassName('processIcon')[0].classList.add('d-none');

        let filesize: Element = playlistItemDiv.getElementsByClassName('filesize')[0];
        filesize.innerHTML = "Filesize:" + Math.floor(item.infoAtLoad.filesize / (1020 * 1024)) + "MB";
        filesize.classList.remove('d-none');

        let duration: Element = playlistItemDiv.getElementsByClassName('duration')[0];
        duration.innerHTML = "Duration:" + item.infoAtLoad._duration_hms;
        duration.classList.remove('d-none');

        let filename: Element = playlistItemDiv.getElementsByClassName('filename')[0];
        filename.innerHTML = "Filename:" + item.infoAtLoad._filename;
        filename.classList.remove('d-none');

        let progress_div: Element = playlistItemDiv.getElementsByClassName('progress_div')[0];
        progress_div.classList.add('bg-danger');

        playlistItemDiv.getElementsByClassName('progress_text')[0].innerHTML = "pending";

        let thumbnail: HTMLImageElement = <HTMLImageElement>playlistItemDiv.getElementsByClassName('thumbnail')[0];
        thumbnail.src = item.infoAtLoad.thumbnail;

        progress_div.classList.remove('d-none');

        if (item.loadIndex < item.list.length - 1) {
            item.loadIndex++;
            let nextId = JSON.parse(item.list[item.loadIndex]).id;
            if (!document.getElementById('pi_' + nextId)) this.showPlaylistItemWaitingDiv(item);
        }

    }

    public showProgressOfPlaylistVideo(item: Item): void {
        var playlist: HTMLElement = document.getElementById('playlist_' + item.id);
        let itemId: string = JSON.parse(item.list[item.downloadIndex]).id;
        let elem: HTMLElement = document.getElementById('pi_' + itemId);
        elem.classList.remove('starting');
        elem.classList.add('downloading');
        playlist.getElementsByClassName('playlistDownloadStatus')[0].innerHTML =
            "downloding " + (item.downloadIndex + 1) + "of " + item.list.length;

    }

    public showAlreadyDownloadedSingleVideoInfo(item:Item):void {
        console.log('-------showAlreadyDownloadedSingleVideoInfo-------');
        console.log(item);
        let singleWaitingVideo = document.getElementById('singleWaiting_' + item.id);
        if (document.getElementById('singleAlreadyDone_' + item.id)) {
            let element = document.getElementById('singleAlreadyDone_' + item.id);
            element.parentNode.removeChild(element);
        }
        singleWaitingVideo.id = "singleAlreadyDone_" + item.id;
        let status = singleWaitingVideo.getElementsByClassName('aDone_status')[0];
        let thumbnail:HTMLImageElement = <HTMLImageElement>singleWaitingVideo.getElementsByClassName('thumbnail')[0];
        let filename = singleWaitingVideo.getElementsByClassName('filename')[0];
        let processIcon = singleWaitingVideo.getElementsByClassName('processIcon')[0];
        let folderIcon = <HTMLElement>singleWaitingVideo.getElementsByClassName('folderIcon')[0];
        processIcon.classList.add('d-none');
        status.classList.remove('d-none');
        thumbnail.src = item.infoAtLoad.thumbnail;
        filename.innerHTML = item.infoAtLoad._filename;
        filename.classList.remove('d-none');
        filename.classList.add('text-center');
    
        folderIcon.onclick = function () {
            ipcRenderer.send('open-already-downloaded-file-directory', item);
        }
        folderIcon.classList.remove('d-none');
    }

    


}


interface ProgressInfo {
    id: string;
    percent: number;
}