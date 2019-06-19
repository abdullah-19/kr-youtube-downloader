
// function addWaitingDiv() {
//     //var video_id = extractId(url);
//     var firstDiv = document.createElement("div");
//     firstDiv.setAttribute("class", "waiting border border-info mx-3");
//     var paragraph = document.createElement("p");
//     paragraph.setAttribute("class", "text-center mb-0");
//     var span = document.createElement("span");
//     span.setAttribute("class", "fa fa-spinner fa-spin py-4");
//     span.setAttribute("style", "font-size:24px");
//     paragraph.appendChild(span);
//     //firstDiv.setAttribute("style", "height:80px;");
//     //firstDiv.setAttribute("id", "temp");//info.id
//     firstDiv.appendChild(paragraph);
//     document.getElementById('video_div').appendChild(firstDiv);
// }

function addVideoDiv(url) {

    isLoading = true;
    var video_id = extractId(url);
    var firstDiv = document.createElement("div");
    firstDiv.setAttribute("class", "row mx-0 border-bottom");
    firstDiv.setAttribute("style", "height:80px;");
    firstDiv.setAttribute("id", "temp");//info.id
    document.getElementById('video_div').appendChild(firstDiv);

    make_firstChild(firstDiv, video_id);

    make_secondChild(firstDiv, video_id);

    make_thirdChild(firstDiv, video_id);

    make_progressDiv(video_id);

}

function make_firstChild(parent, video_id) {

    var firstChildOfParent = document.createElement("div");
    firstChildOfParent.setAttribute("class", "col-md-2");
    firstChildOfParent.setAttribute("style", "height: 100%;");
    parent.appendChild(firstChildOfParent);

    var imageChildOfFirstChildOfParent = document.createElement("img");
    imageChildOfFirstChildOfParent.setAttribute("id", "videoThumbnail_" + video_id);//"videoThumbnail_"+info.id
    imageChildOfFirstChildOfParent.setAttribute("src", "");// info.thumbnails[0].url
    imageChildOfFirstChildOfParent.setAttribute("style", "display: none; height:100%;width:100%;");
    firstChildOfParent.appendChild(imageChildOfFirstChildOfParent);//arg.thumbnails[0].url

}

function make_secondChild(parent, video_id) {
    var firstChildOfParent = document.createElement("div");
    firstChildOfParent.setAttribute("class", "col-md-9");
    firstChildOfParent.setAttribute("style", "height:inherit;");
    parent.appendChild(firstChildOfParent);

    var pChildOfFirstChildOfParent = document.createElement("p");
    pChildOfFirstChildOfParent.setAttribute("class", "small");
    pChildOfFirstChildOfParent.setAttribute("id", "filesize_" + video_id);
    pChildOfFirstChildOfParent.setAttribute("style", "margin: 2px;");
    firstChildOfParent.appendChild(pChildOfFirstChildOfParent);

    var p2ChildOfFirstChildOfParent = document.createElement("p");
    p2ChildOfFirstChildOfParent.setAttribute("class", "small");
    p2ChildOfFirstChildOfParent.setAttribute("id", "duration_" + video_id);
    p2ChildOfFirstChildOfParent.setAttribute("style", "margin: 2px;");
    firstChildOfParent.appendChild(p2ChildOfFirstChildOfParent);

    var p3ChildOfFirstChildOfParent = document.createElement("p");
    p3ChildOfFirstChildOfParent.setAttribute("class", "small");
    p3ChildOfFirstChildOfParent.setAttribute("id", "filename_" + video_id);
    p3ChildOfFirstChildOfParent.setAttribute("style", "margin: 2px;");
    firstChildOfParent.appendChild(p3ChildOfFirstChildOfParent);

    var iChildOfFirstChildOfParent = document.createElement("i");
    iChildOfFirstChildOfParent.setAttribute("class", "fa fa-spinner fa-spin");
    iChildOfFirstChildOfParent.setAttribute("id", "processIcon_" + video_id);
    iChildOfFirstChildOfParent.setAttribute("style", "position: absolute;top: 30%;left: 40%; font-size:32px;color:lightcoral;");
    firstChildOfParent.appendChild(iChildOfFirstChildOfParent);


}



function make_thirdChild(parent, video_id) {

    var firstChildOfParent = document.createElement("div");
    firstChildOfParent.setAttribute("class", "col-md-1 align-self-center");
    parent.appendChild(firstChildOfParent);

    var imgChildOfFirstChildOfParent = document.createElement("img");
    imgChildOfFirstChildOfParent.setAttribute("src", "res/images/dwonload_continous.gif");
    imgChildOfFirstChildOfParent.setAttribute("id", "downloadingIcon_" + video_id);
    imgChildOfFirstChildOfParent.setAttribute("style", "height:40px;width:40px;display: none;");
    firstChildOfParent.appendChild(imgChildOfFirstChildOfParent);

    var iChildOfFirstChildOfParent = document.createElement("i");
    iChildOfFirstChildOfParent.setAttribute("class", "fa fa-folder-open");
    iChildOfFirstChildOfParent.setAttribute("id", "folderIcon_" + video_id);
    iChildOfFirstChildOfParent.setAttribute("style", "font-size:32px;color:blue; display: none;");
    iChildOfFirstChildOfParent.onmouseover = function () {
        this.style["color"] = "brown";
        this.style["font-size"] = "36px";
    } //onmouseleave 

    iChildOfFirstChildOfParent.onmouseleave = function () {
        this.style["color"] = "blue";
        this.style["font-size"] = "32px";
    }

    // iChildOfFirstChildOfParent.onclick = function(){
    //   ipcRenderer.send('open_file_directory',);
    // }

    firstChildOfParent.appendChild(iChildOfFirstChildOfParent);

}

function make_progressDiv(video_id) {

    var div1 = document.createElement("div");
    div1.setAttribute("id", "progressDiv_" + "temp");
    div1.setAttribute("class", "row mx-0");
    div1.setAttribute("style", "height:18px; display: none;");
    document.getElementById("video_div").appendChild(div1);

    var div11 = document.createElement("div");
    div11.setAttribute("id", "parentOfprogressBar_" + video_id);
    div11.setAttribute("class", "col-md-12 p-0 border");
    div11.setAttribute("style", "height: 100%;");
    div1.appendChild(div11);

    var div111 = document.createElement("div");
    div111.setAttribute("id", "progressBar_" + video_id);
    div111.setAttribute("class", "bg-info text-center border border-danger");
    div111.setAttribute("style", "height:100%;width:0%;");
    div11.appendChild(div111);

    var p1111 = document.createElement("p");
    p1111.setAttribute("id", "progress_" + video_id);
    p1111.setAttribute("class", "small");
    p1111.setAttribute("style", "position:absolute; top:0;left: 50%;");
    div111.appendChild(p1111);
}

function show_processIcon() {

    //var videoInfoDiv = document.getElementById('video_info_div');
    document.getElementById('filesize').innerHTML = "";
    document.getElementById('duration').innerHTML = "";
    document.getElementById('filename').innerHTML = "";
    folderIcon.style.display = "none";
    //videoThumbnail
    document.getElementById('videoThumbnail').style.display = "none";
    downloadBtn.style.display = "none";
    document.getElementById('video_div').style.display = "block";
    processIcon.style.display = "inline-block";

}


function showVideoInfo(info) {

    console.log('------in fun showVideoInfo----------');
    var arg = info.loadedInfo;
    console.log(arg);
    var id = arg.id;
    //if (document.getElementById(arg.id) != null) {
    if (document.getElementById(id) != null) {
        document.getElementById('video_div').removeChild(document.getElementById(id));
        document.getElementById('video_div').removeChild(document.getElementById('progressDiv_' + id));
    }
    document.getElementById('temp').id = id;
    document.getElementById('progressDiv_temp').id = 'progressDiv_' + id;
    isLoading = false;

    showThumbNailAndName(arg);
    document.getElementById("processIcon_" + id).style.display = "none";
    document.getElementById('downloadingIcon_' + id).style.display = "inline";
    document.getElementById('folderIcon_' + id).onclick = function () {
        ipcRenderer.send('open-file-directory', info);
    }
    //status_text.innerHTML = "Downloading...";
    // status_text.style.color = "blue";
    //downloadProgress(arg._filename,arg.size);
    showBasicInfo(arg);
    //downloadProgress(arg);
    //downloadNext();
}

function showBasicInfo(info) {
    var id = info.id;
    document.getElementById("processIcon_" + id).style.display = "none";
    document.getElementById('filesize_' + id).innerHTML = "Size(KB):" + info.filesize;
    document.getElementById('duration_' + id).innerHTML = "Duration(h:m:s:):" + info._duration_hms;
    document.getElementById('filename_' + id).innerHTML = "Filename:" + info._filename;
}

function showProgressBar() {
    var progBar = document.getElementById('progress_bar');
    progBar.style.display = "block";
}


// function downloadProgress(arg) {
//     var downloadedSize;
//     var info = arg.loadedInfo;
//     console.log('--------in fun downloadProgress---------');
//     console.log('info.id: in progress :');
//     console.log(info.id);
//     var progressDiv = document.getElementById('progressDiv_' + info.id);
//     progressDiv.style.display = "block";
//     var progressStatus = document.getElementById('progress_' + info.id);
//     var progressBar = document.getElementById('progressBar_' + info.id);
//     progressBar.style.display = "block";
//     var parcentOfProgress;
//     var parecentStr;
//     var progress = setInterval(() => {
//         //downloadedSize = getFileSize(info._filename);
//         downloadedSize = getFileSize(info.downloadFilePath);

//         parcentOfProgress = downloadedSize / info.size;
//         parcentOfProgress = parcentOfProgress * 100;
//         progressBar.style.width = parcentOfProgress + "%";
//         progressStatus.innerHTML = Math.floor(parcentOfProgress) + "%";
//         //console.log(downloadedSize);
//         if (downloadedSize == info.size) {
//             ipcRenderer.send('download-complete', arg);
//             clearInterval(progress);
//             processNextVideo();
//             progressDiv.style.display = "none";
//             //updateQueue();
//         }
//     }, 500);
// }




function fadeOut(id, val) {
    if (isNaN(val)) { val = 9; }
    document.getElementById(id).style.opacity = '0.' + val;
    //For IE
    document.getElementById(id).style.filter = 'alpha(opacity=' + val + '0)';
    if (val > 0) {
        val--;
        setTimeout('fadeOut("' + id + '",' + val + ')', 90);
    } else {
        document.getElementById(id).style.display = "none";
        return;
    }
}


function fadeIn(id, val) {
    // ID of the element to fade, Fade value[min value is 0]
    if (isNaN(val)) { val = 0; }
    document.getElementById(id).style.opacity = '0.' + val;
    //For IE
    document.getElementById(id).style.filter = 'alpha(opacity=' + val + '0)';
    if (val < 9) {
        val++;
        setTimeout('fadeIn("' + id + '",' + val + ')', 200);
    } else { return; }
}


function decreamentTransparency(element) {
    console.log("element.style.opacity:" + element.style.opacity);
    if (element.style.opacity > 0) element.style.opacity -= 0.1;
    else clearInterval(decreamentTransparency);
}

function showThumbNailAndName(info) {
    console.log('in showThumbnail:');
    console.log(info.id);
    var thumbnail = document.getElementById("videoThumbnail_" + info.id);
    thumbnail.src = info.thumbnails[0].url;
    thumbnail.style.display = "inline-block";
}

function clear_status() {
    status_text.innerHTML = "";
    if (downloadBtn.style.display == "none") {
        downloadBtn.style.display = "inline-block";
        processIcon.style.display = "none";
    }
}

ipcRenderer.on('move-complete', (event, info) => {
    var arg = info.loadedInfo;
    console.log('move completed');
    document.getElementById('downloadingIcon_' + arg.id).style.display = "none";
    document.getElementById('folderIcon_' + arg.id).style.display = "inline-block";

});

// function showWaiting() {
//     var div1 = document.createElement("div");
//     //div1.setAttribute("id", "progressDiv_" + "temp");
//     div1.setAttribute("class", "waiting");
//     var paragraph = document.createElement("p");
//     paragraph.setAttribute("class", "p-1 bg-info text-center");
//     paragraph.innerHTML = "Waiting...";
//     //div1.setAttribute("style", "height:18px; display: none;");
//     div1.appendChild(paragraph);
//     document.getElementById("video_div").appendChild(div1);
// }

function showSingleVideoWaitingDiv(id) {
    console.log('----showSingleVideoWaitingDiv-----');
    var waitingDiv = document.querySelector('#singleWaitingDemo').cloneNode(true);
    waitingDiv.id = "";
    waitingDiv.classList.remove("d-none");
    waitingDiv.classList.add('singleWaiting_'+id);
    var sibling = document.getElementById('singleWaitingDemo');
    sibling.parentNode.insertBefore(waitingDiv, sibling.nextSibling);
    //head.parentNode.insertBefore(myEle,head.nextSibling)
    //element.classList.remove("mystyle");
}

function showSingleVideoInfo(item) {
    console.log('----showSingleVideoInfo----');
    var info = item.infoAtLoad;

    let singleVideos = document.getElementById('single_videos');
    var infoDiv = singleVideos.getElementsByClassName('singleWaiting_'+item.id)[0]

    //var infoDiv = document.getElementsByClassName('singleWaiting')[0];
    if (document.getElementById('s_' + item.id)) {
        let ele = document.getElementById('s_' + item.id);
        ele.parentNode.removeChild(ele);
    }

    infoDiv.classList.remove('singleWaiting_'+item.id);
    infoDiv.id = 's_' + item.id;
    infoDiv.getElementsByClassName('thumbnail')[0].src = item.infoAtLoad.thumbnail;

    var filesize = infoDiv.getElementsByClassName('filesize')[0];
    filesize.innerHTML = "Filesize:" + (info.filesize / 1024) + "MB";
    filesize.classList.remove('d-none');

    var duration = infoDiv.getElementsByClassName('duration')[0];
    duration.innerHTML = "Duration:" + info._duration_hms;
    duration.classList.remove('d-none');

    var filename = infoDiv.getElementsByClassName('filename')[0];
    filename.innerHTML = "Filename:" + info._filename;
    filename.classList.remove('d-none');

    infoDiv.getElementsByClassName('progress_div')[0].id = "pds_" + item.id;
    infoDiv.getElementsByClassName('progress_bar')[0].id = "pbs_" + item.id;
    infoDiv.getElementsByClassName('progress_text')[0].id = "pts_" + item.id;

    filename.innerHTML = "filename:" + info._filename;
    filename.classList.remove('d-none');

    infoDiv.getElementsByClassName('processIcon')[0].classList.add('d-none');

}


// function showProgressOfSingleVideo(item) {
//     console.log('----showProgressOfSingleVideo----');
//     console.log('id:');
//     console.log(item.id);
//     var videoDiv = document.getElementById('s_' + item.id);
//     var progressDiv = videoDiv.getElementsByClassName('progress_div')[0];
//     progressDiv.classList.remove('d-none');
//     var progressBar = progressDiv.getElementsByClassName('progress_bar')[0];
//     var progressText = progressDiv.getElementsByClassName('progress_text')[0];

//     var f = setInterval(() => {
//         progressBar.style.width = item.downloadProgress + "%";
//         progressText.innerHTML = item.downloadProgress + "%";
//         if (item.downloadProgress == 100) clearInterval(f);
//     }, 500);

// }


ipcRenderer.on('download-progress', function (event, progressInfo) {
    //console.log('--------in ipcRenderer download-progress--------------');
    //console.log('progressInfo.id:' + progressInfo.id);
    //console.log('progressInfo.percent:' + progressInfo.percent);
    document.getElementById('pbs_' + progressInfo.id).style.width = progressInfo.percent + "%";
    document.getElementById('pts_' + progressInfo.id).innerHTML = progressInfo.percent + "%";

});

ipcRenderer.on('playlist-download-progress', function (event, progressInfo) {

    console.log('--------ipcRenderer playlist-download-progress--------------');
    console.log('progressInfo.id:' + progressInfo.id);
    console.log('progressInfo.percent:' + progressInfo.percent);
    document.getElementById('pbp_' + progressInfo.id).style.width = progressInfo.percent + "%";
    document.getElementById('ptp_' + progressInfo.id).innerHTML = progressInfo.percent + "%";

});

ipcRenderer.on('download-complete', (event, item) => {
    console.log('----ipcRenderer download-complete---');
    var iconDiv;
    if (item.isPlaylist) {
        console.log('id:' + item.infoAtDownload.id);
        iconDiv = document.getElementById('pi_' + item.infoAtDownload.id);
    }
    else {
        iconDiv = document.getElementById('s_' + item.id);
    }

    var folderIcon = iconDiv.getElementsByClassName('folderIcon')[0];
    folderIcon.classList.remove('d-none');

    var progressDiv = iconDiv.getElementsByClassName('progress_div')[0];
    progressDiv.classList.add('d-none');

    folderIcon.onclick = function () {
        ipcRenderer.send('open-file-directory', item);
    }

});

function showPlaylistWaitingDiv(url) {
    console.log('----showPlaylistWaitingDiv-----');
    let id = getPlaylistId(url);
    var waitingDiv = document.querySelector('#playlist_demo').cloneNode(true);
    waitingDiv.id = "playlist_" + id;
    waitingDiv.classList.remove("d-none");
    var sibling = document.getElementById('playlist_demo');
    sibling.parentNode.insertBefore(waitingDiv, sibling.nextSibling);

    var playlistItemDemo = waitingDiv.getElementsByClassName('playlistItem')[0];
    console.log('playlist item demo:');
    playlistItemDemo.id = "piDemo_" + id;
    console.log(playlistItemDemo);

}

function showPlaylistItemWaitingDiv(item) {
    console.log('-----showPlaylistItemWaitingDiv------');

    //var playlistDiv = document.getElementById('playlist_'+item.id);

    var waitingItemDiv = document.querySelector('#piDemo_' + item.id).cloneNode(true);
    console.log('loadIndex:' + item.loadIndex);
    let id = JSON.parse(item.list[item.loadIndex + 1]).id;
    console.log('id:' + item.id);
    //var waitingItemDiv = playlistDiv.getElementsByClassName('playlistItem');
    waitingItemDiv.id = "pi_" + id;
    waitingItemDiv.classList.remove("d-none");
    var sibling = document.getElementById('piDemo_' + item.id);
    console.log('sibling:');
    console.log(sibling);
    //sibling.parentNode.insertBefore(waitingItemDiv, sibling.nextSibling);
    sibling.parentNode.appendChild(waitingItemDiv);

    waitingItemDiv.getElementsByClassName('progress_bar')[0].id = 'pbp_' + id;
    waitingItemDiv.getElementsByClassName('progress_text')[0].id = 'ptp_' + id;

}

function showPlaylistItemInfo(item) {

    console.log('------showPlaylistItemInfo------');
    console.log(item);
    let playlistItemDiv = document.getElementById('pi_' + item.infoAtLoad.id);
    console.log('pi_' + item.infoAtLoad.id);
    console.log(playlistItemDiv);

    playlistItemDiv.getElementsByClassName('processIcon')[0].classList.add('d-none');

    let filesize = playlistItemDiv.getElementsByClassName('filesize')[0];
    filesize.innerHTML = "Filesize:" + Math.floor(item.infoAtLoad.filesize / (1020 * 1024)) + "MB";
    filesize.classList.remove('d-none');

    let duration = playlistItemDiv.getElementsByClassName('duration')[0];
    duration.innerHTML = "Duration:" + item.infoAtLoad._duration_hms;
    duration.classList.remove('d-none');

    let filename = playlistItemDiv.getElementsByClassName('filename')[0];
    filename.innerHTML = "Filename:" + item.infoAtLoad._filename;
    filename.classList.remove('d-none');

    let progress_div = playlistItemDiv.getElementsByClassName('progress_div')[0];
    progress_div.classList.add('bg-danger');

    playlistItemDiv.getElementsByClassName('progress_text')[0].innerHTML = "pending";

    let thumbnail = playlistItemDiv.getElementsByClassName('thumbnail')[0];
    thumbnail.src = item.infoAtLoad.thumbnail;

    progress_div.classList.remove('d-none');

    if (item.loadIndex < item.list.length - 1) {
        showPlaylistItemWaitingDiv(item);
    }

}

function showProgressOfPlaylistVideo(item) {
    var playlist = document.getElementById('playlist_' + item.id);
    playlist.getElementsByClassName('progress_div')[0].classList.remove('bg-danger');
    playlist.getElementsByClassName('playlistDownloadStatus')[0].innerHTML =
        "downloding " + (item.downloadIndex + 1) + "of " + item.list.length;

}

ipcRenderer.on('already-downloading', (event, item) => {
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

ipcRenderer.on('already-downloaded', (event, item) => {

    console.log('-----ipcRenderer already-downloaded--------');
    if (item.isPlaylist) {
        let playlistItem = document.getElementsByClassName('');
        let status = playlistItem.getElementsByClassName('a_done')[0];
        let processIcon = playlistItem.getElementsByClassName('processIcon')[0];
        processIcon.classList.add('d-none');
        status.classList.remove('d-none');

    }
    else {
        showAlreadyDownloadedSingleVideoInfo(item);
    }
});

function showAlreadyDownloadedSingleVideoInfo(item) {
    console.log('-------showAlreadyDownloadedSingleVideoInfo-------');
    console.log(item);
    let singleWaitingVideo = document.getElementsByClassName('singleWaiting_'+item.id)[0];
    singleWaitingVideo.classList.remove('singleWaiting_'+item.id);
    singleWaitingVideo.classList.add('already_doneDiv');
    singleWaitingVideo.id = 'ad_'+item.infoAtLoad.id;
    let status = singleWaitingVideo.getElementsByClassName('aDone_status')[0];
    let thumbnail = singleWaitingVideo.getElementsByClassName('thumbnail')[0];
    let filename = singleWaitingVideo.getElementsByClassName('filename')[0];
    let processIcon = singleWaitingVideo.getElementsByClassName('processIcon')[0];
    let folderIcon = singleWaitingVideo.getElementsByClassName('folderIcon')[0];
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

ipcRenderer.on('already-downloadeding',function(event,item){
    if(item.isPlaylist){

    }
    else{
        
    }
});