
function loadVideo(info) {
    console.log('--------- in fun loadVideo----------');
    var url;
    ipcRenderer.send('start-load', info);
    if (info.type === "single") url = info.url;
    else if (info.type === "playlist") {
        var id = JSON.parse(info.list[info.currentLoadItem]).id;
        url = getUrlFromId(id);
    }
    addVideoDiv(url);
}


function downloadFromQueue() {
    download_video(queue.toDownload.shift());
}

ipcRenderer.on('load-complete', function (event, item) {
    console.log('--------in ipcRenderer load-complete--------------');
    console.log(item);
    console.log('video type:');
    console.log(item.isPlaylist);
    if (item.isPlaylist) {
        console.log('getPlaylistLoadItemId(item)');
        console.log(getPlaylistLoadItemId(item));
        console.log('item.loadIndex:');
        console.log(item.loadIndex);
        console.log('playlist load item id:');
        console.log(getPlaylistLoadItemId(item));
        let elem = document.getElementById("pi_" + getPlaylistLoadItemId(item));
        if (!elem) {
            console.log('element not created');
            return;
        }
        if (elem.classList.contains('waiting')) {
            showPlaylistItemInfo(item);
        }
    }
    else {
        if (document.getElementById('singleAlreadyDone_' + item.id)) {
            let elem = document.getElementById('singleAlreadyDone_' + item.id);
            elem.parentNode.removeChild(elem);
        }
        showSingleVideoInfo(item);
        ipcRenderer.send('start-single-video-download', item);
    }

});

ipcRenderer.on('download-started', function (event, item) {
    console.log('---ipcRenderer download-started-------');
    console.log('item:');
    console.log(item);

    if (item.isPlaylist) {
        showProgressOfPlaylistVideo(item);
    }
    else {
        document.getElementById('pds_' + item.id).classList.remove('d-none');
    }
});


function loadNext() {
    var info = queue.toLoad[0];
    loadVideo(info);
}


function processNextVideo() {
    var info = queue.toDownload[0];
    if (info.type === "single") queue.toDownload.shift();
    else if (info.type === "playlist") {
        if (info.currentDownloadItem >= info.list.length) {
            queue.toDownload.shift();
            if (queue.toDownload.length === 0) queue.isDownloading = false;
        }
        else queue.toDownload[0].currentDownloadItem++;
    }
    if (queue.toDownload.length != 0) downloadNext();
}

ipcRenderer.on('list-downloaded', function (event, item) {
    console.log('---ipcRenderer list-downloaded----');
    let playlistDiv = document.getElementById('playlist_' + item.id);
    playlistDiv.getElementsByClassName('p_title')[0].innerHTML = item.folderName;

});

ipcRenderer.on('downloading-playlist', (event, item) => {
    console.log('-------downloading-playlist---------');
    console.log(item);
    let playlistDiv = document.getElementById('playlist_' + item.id);
    playlistDiv.getElementsByClassName('waitngIconOfPlaylist')[0].classList.add('d-none');

    let status = playlistDiv.getElementsByClassName('playlistDownloadStatus')[0];
    status.innerHTML = "starting download...";
    status.classList.remove('d-none');

    playlistDiv.getElementsByClassName('collapse')[0].classList.add('show');
    item.loadIndex++;
    showPlaylistItemWaitingDiv(item);

});

ipcRenderer.on('check-load-of-playlist-item', function (event, item) {
    console.log('-----check-load-of-playlist-item-----');
    checkLoadOfPlaylistItem(item);
})

function checkLoadOfPlaylistItem(item) {
    let waitingTime = 0;
    (function me() {
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
            me();
            return;
        }

        if (waitingTime > 20) {
            console.log('waiting time for load exeeded, so skipping');
            item.downloadIndex++;
            waitingTime = 0;
            me();
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
        checkForDownloadStart(item);

    })();
}

function checkForDownloadStart(item) {
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
            if(item.downloadIndex+1 < item.list.length){
                let copyItem = { ...item };
                copyItem.downloadIndex++;
                checkLoadOfPlaylistItem(copyItem);
            }
            //ipcRenderer.send('download-playlist-item', copyItem);
        }
    }, 15 * 1000);

}
