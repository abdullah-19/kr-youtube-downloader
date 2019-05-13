const fs = require('fs');
const path = require('path');
const ipcRenderer = require('electron').ipcRenderer;
// wait for an updateReady message
const downloadBtn = document.getElementById('downloadBtn');
const urlField = document.getElementById('urlField');
const processIcon = document.getElementById('processIcon');
//const folderIcon = document.getElementById('folderIcon');
const status_text = document.getElementById('error_text');
const update_button = document.getElementById('updateBtn');
const closeIcon = document.getElementById('closeIcon');
const downloadingIcon = document.getElementById('downloadingIcon');
var isLoading = false;

var queue = {
    toLoad: [],
    toDownload: []
};



downloadBtn.addEventListener('click', function () {
    start_process();
});

function start_process() {
    console.log('download button clicked');
    var url = urlField.value;
    //var url_status = isValidUrl(url);
    if (queue.toDownload.length === 0) {
        queue.isDownloading = false;
    }
    if (url == "") {
        status_text.innerHTML = "Please insert url";
    }
    // else if (url_status == 1) {
    //     var info = {};
    //     console.log('url status 1');
    //     info.type = "single";
    //     info.url = url;
    //     queue.toLoad.push(info);
    //     queue.toDownload.push(info);
    //     //download_video(url);
    //     if (queue.toLoad.length === 1) {
    //         //queue.isDownloading = false;
    //         loadNext();
    //     }

    // }
    // else if (url_status === 2) {
    //     //download_playlist(url);

    //     var info = {};
    //     info.type = "playlist";
    //     info.folderName = "playlist:" + getDateTime();
    //     ipcRenderer.send('start-playlist-download', url);
    // }
    // else {
    //     //show_processIcon();
    //     status_text.innerHTML = "Url is not valid";
    //     // console.log('in start process');
    //     // console.log("before extract:" + url);
    //     // addVideoDiv(url);
    //     // ipcRenderer.send('start_download', url);
    // }

    if (isValidUrl(url)) {
        ipcRenderer.send('start-process', url);
    }
    else {
        status_text.innerHTML = "Url is not valid";
    }

    console.log("Url:" + url);
}

function getDateTime() {
    var date = new Date();
    var time = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    var current_date = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    return time + " " + current_date;
}