
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


// function download_video(info) {
//     console.log('----------in fun download_video----------');
//     console.log('downloading video');
//     var url;
//     //var info = queue.toDownload[0];
//     console.log('info');
//     console.log(info);
//     ipcRenderer.send('start_download', info);
//     if (info.type === "single") url = info.url;
//     else if (info.type === "playlist") {
//         var id = JSON.parse(info.list[info.currentDownloadItem]).id;
//         url = getUrlFromId(id);
//     }

// }

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
        if(document.getElementById("pi_"+getPlaylistLoadItemId(item)).classList.contains('waiting')){
            showPlaylistItemInfo(item);
            //ipcRenderer.send('load-next-playlist-item', item);
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

ipcRenderer.on('check-load-of-playlist-item', function (event,item){

    console.log('---check-load-of-playlist-item---');
    (function me(){
        console.log('--item.downloadIndex:');
        console.log(item.downloadIndex);
        let id = JSON.parse(item.list[item.downloadIndex]).id;
        console.log(id);
        let elem = document.getElementById('pi_' + id);
        if(!elem){
            console.log('playlist waiting div not created, download index:'+item.downloadIndex);
            setTimeout(me, 1000);
            return;
        }
        if (elem.classList.contains('waiting')){
            console.log('playlist item in waiting, download index:'+item.downloadIndex);
            setTimeout(me, 1000);
            return;
        }
        console.log('playlist item info exist');
        ipcRenderer.send('download-playlist-item', item);
    
    })();
    
    
    // if (!elem.classList.contains('waiting')){
    //     console.log('not contain waiting');
    //     ipcRenderer.send('download-playlist-item', item);
    // }
    // else {
    //     console.log('---contain waiting----');
    //     let f = setInterval(() => {
    //         if (!elem.classList.contains('waiting')) {
    //             console.log('---in interval---')
    //             clearInterval(f);
    //             ipcRenderer.send('download-playlist-item', item);
    //         }
    //     }, 2000);
    // }
})
