
function loadVideo(info) {
    console.log('loading video');
    var url;
    //var info = queue.toLoad[0];
    //console.log('info');
    //console.log(info);
    ipcRenderer.send('start_load', info);
    if (info.type === "single") url = info.url;
    else if (info.type === "playlist") {
        var id = JSON.parse(info.list[info.currentLoadItem]).id;
        url = getUrlFromId(id);
    }
    addVideoDiv(url);
}


function download_video(info) {
    console.log('----------in fun download_video----------');
    console.log('downloading video');
    var url;
    //var info = queue.toDownload[0];
    console.log('info');
    console.log(info);
    ipcRenderer.send('start_download', info);
    if (info.type === "single") url = info.url;
    else if (info.type === "playlist") {
        var id = JSON.parse(info.list[info.currentDownloadItem]).id;
        url = getUrlFromId(id);
    }
    /// addVideoDiv(url);
    //ipcRenderer.send('start_download', url);
}


function downloadFromQueue() {
    download_video(queue.toDownload.shift());
}


ipcRenderer.on('load-complete', function (event, info) {
    console.log('--------in ipcRenderer load-complete--------------');
    showVideoInfo(info.loadedInfo);
    
    console.log(info);
    console.log('video type:');
    console.log(info.type);
    if (info.type === "single") {
        queue.toLoad.shift();
        console.log('after deleting single video, size:' + queue.toLoad.length);
    }
    else if (info.type === "playlist") {
        if (info.currentLoadItem >= info.list.length) queue.toLoad.shift();
        else queue.toLoad[0].currentLoadItem++;
    }
    if (!queue.isDownloading && queue.toDownload.length != 0) {
        console.log('not queue');
        queue.isDownloading = true;
        downloadNext();
    }
    if (queue.toLoad.length != 0) {
        console.log('queue not empty, size:' + queue.toLoad.length);

        loadNext();
    }

});


ipcRenderer.on('download-started', function (event, arg) {
    // const message = `Message reply: ${arg}`
    //status_text.innerHTML = "Downloading...";
    // status_text.style.color = "blue";
    //downloadProgress(arg._filename,arg.size);
    // showBasicInfo(arg);
    downloadProgress(arg.loadedInfo);
    //downloadNext();
});


function loadNext() {
    var info = queue.toLoad[0];
    // if(info.type === "single") queue.toLoad.shift();
    // else if(info.type === "playlist"){
    //   if(info.currentLoadItem>= info.list.length) queue.toLoad.shift();
    //   else queue.toLoad[0].currentLoadItem++;
    // }
    loadVideo(info);
}


function downloadNext() {
    console.log('-----in fun downloadNext--------');
    var info = queue.toDownload[0];
    // if(info.type === "single") queue.toDownload.shift();
    // else if(info.type === "playlist"){
    //   if(info.currentDownloadItem>= info.list.length) {
    //     queue.toDownload.shift();
    //     if(queue.toDownload.length === 0) queue.isDownloading = false;
    //   }
    //   else queue.toDownload[0].currentDownloadItem++;
    // }
    console.log('next download');
    download_video(info);
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



ipcRenderer.on('video-list', function (event, info) {
    console.log('-----------------in ipcRenderer video-list------------------');
    var playlist = {};
    //var folderName = "Playlist:" + d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate() + " " + d.toLocaleTimeString();
    // playlist.list = video_list;
    // playlist.folderName = folderName;
    // playlist.currentItem = 0;
    // console.log('video_list');
    // var url;
    //for(var i=0;i<video_list.length;i++){
    //console.log('i:'+i);
    queue.toDownload.push(info);
    queue.toLoad.push(info);
    // if(queue.toLoad.length == 1) download_video();
    if(queue.toLoad.length == 1) loadVideo(info);
    // url = "https://www.youtube.com/watch?v=" + JSON.parse(video_list[0]).id;
    // console.log('url:' + url);
    //download_video(url);
    //download_playlistItem(playlist);
    // while(true){
    //   if(!isLoading){
    //     console.log('not loading');
    //     download_video(url);
    //     break;
    //   }
    // }
  
    //}
    //console.log(video_list);
  })
