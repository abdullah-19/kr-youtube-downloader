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
    console.log('--start_process----');
    var url = urlField.value;

    if (url == "") {
        status_text.innerHTML = "Please insert url";
    }

    else if (isValidUrl(url)) {
        if (is_playlist(url)) {
            let id = getPlaylistId(url);
            if(document.getElementById('playlist_'+id)){
                let elem = document.getElementById('playlist_'+id);
                if(!elem.classList.contains('inProgress')){
                    elem.parentNode.removeChild(elem);
                    showPlaylistWaitingDiv(url);    
                    ipcRenderer.send('start-process', url);
                }
            }
            else{
                showPlaylistWaitingDiv(url);
                ipcRenderer.send('start-process', url);
            }
            
        }
        else {
            let id = extractId(url);
            if(!document.getElementById('singleWaiting_'+id)){
                //console.log('');
                showSingleVideoWaitingDiv(id);
                ipcRenderer.send('start-process', url);
            }   
        }
        
    }

    else {
        status_text.innerHTML = "Url is not valid";
    }

    console.log("Url:" + url);
}
