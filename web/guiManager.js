
function addWaitingDiv(){
    //var video_id = extractId(url);
    var firstDiv = document.createElement("div");
    firstDiv.setAttribute("class", "waiting border border-info mx-3");
    var paragraph = document.createElement("p");
    paragraph.setAttribute("class","text-center mb-0");
    var span = document.createElement("span");
    span.setAttribute("class","fa fa-spinner fa-spin py-4");
    span.setAttribute("style","font-size:24px");
    paragraph.appendChild(span);
    //firstDiv.setAttribute("style", "height:80px;");
    //firstDiv.setAttribute("id", "temp");//info.id
    firstDiv.appendChild(paragraph);
    document.getElementById('video_div').appendChild(firstDiv);
}

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


function downloadProgress(arg) {
    var downloadedSize;
    var info = arg.loadedInfo;
    console.log('--------in fun downloadProgress---------');
    console.log('info.id: in progress :');
    console.log(info.id);
    var progressDiv = document.getElementById('progressDiv_' + info.id);
    progressDiv.style.display = "block";
    var progressStatus = document.getElementById('progress_' + info.id);
    var progressBar = document.getElementById('progressBar_' + info.id);
    progressBar.style.display = "block";
    var parcentOfProgress;
    var parecentStr;
    var progress = setInterval(() => {
        //downloadedSize = getFileSize(info._filename);
        downloadedSize = getFileSize(info.downloadFilePath);

        parcentOfProgress = downloadedSize / info.size;
        parcentOfProgress = parcentOfProgress * 100;
        progressBar.style.width = parcentOfProgress + "%";
        progressStatus.innerHTML = Math.floor(parcentOfProgress) + "%";
        //console.log(downloadedSize);
        if (downloadedSize == info.size) {
            ipcRenderer.send('download-complete', arg);
            clearInterval(progress);
            processNextVideo();
            progressDiv.style.display = "none";
            //updateQueue();
        }
    }, 500);
}


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

function showWaiting(){
    var div1 = document.createElement("div");
    //div1.setAttribute("id", "progressDiv_" + "temp");
    div1.setAttribute("class", "waiting");
    var paragraph = document.createElement("p");
    paragraph.setAttribute("class", "p-1 bg-info text-center");
    paragraph.innerHTML = "Waiting...";
    //div1.setAttribute("style", "height:18px; display: none;");
    div1.appendChild(paragraph);
    document.getElementById("video_div").appendChild(div1);
}