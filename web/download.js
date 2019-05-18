
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
    if(item.isPlaylist){
        showPlaylistItemInfo(item);
    }
    else{
        showSingleVideoInfo(item);
    }
    
});

ipcRenderer.on('download-started', function (event, item) {
    console.log('---ipcRenderer download-started-------');
    console.log('item:');
    console.log(item);

    if(item.isPlaylist){
        showProgressOfPlaylistVideo(item);
    }
    else{
       document.getElementById('pds_'+item.id).classList.remove('d-none');
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

ipcRenderer.on('list-downloaded',function(event, item){
    console.log('---ipcRenderer list-downloaded----');
    var playlistDiv = document.getElementById('playlist_'+item.id);
    playlistDiv.getElementsByClassName('p_title')[0].innerHTML = item.folderName;

});

ipcRenderer.on('downloading-playlist', function(event, item){

    var playlistDiv = document.getElementById('playlist_'+item.id);
    playlistDiv.getElementsByClassName('waitngIconOfPlaylist')[0].classList.add('d-none');
    
    var status = playlistDiv.getElementsByClassName('playlistDownloadStatus')[0];
    status.innerHTML = "starting download...";
    status.classList.remove('d-none');
    
    playlistDiv.getElementsByClassName('collapse')[0].classList.add('show');
    showPlaylistItemWaitingDiv(item);

});
