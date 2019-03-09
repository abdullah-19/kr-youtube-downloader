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


function showThumbNailAndName(info) {
  var thumbnail = document.getElementById("videoThumbnail_" + info.id);
  thumbnail.src = info.thumbnails[0].url;
  thumbnail.style.display = "inline-block";
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

function fadeOutUpdateBar() {
  fadeOut("update-bar", 9);
}

function decreamentTransparency(element) {
  console.log("element.style.opacity:" + element.style.opacity);
  if (element.style.opacity > 0) element.style.opacity -= 0.1;
  else clearInterval(decreamentTransparency);
}

update_button.addEventListener('click', function () {
  console.log('update button clicked');
  ipcRenderer.send('install-update');
});


downloadBtn.addEventListener('click', function () {
  start_process();
  //addVideoDiv();
});

function start_process() {
  console.log('download button clicked');
  var url = urlField.value;
  if (url == "") {
    status_text.innerHTML = "Please insert url";
  }
  else if (!isValidUrl(url)) {
    status_text.innerHTML = "Url is not valid";
  }
  else {
    //show_processIcon();
    console.log('in start process');
    console.log("before extract:" + url);
    addVideoDiv(url);
    ipcRenderer.send('start_download', url);
  }

  //ipcRenderer.send('start_download', url);  
  console.log("Url:" + url);
}

function addVideoDiv(url) {//parameter info
  var video_id = extractId(url);
  var firstDiv = document.createElement("div");
  //firstDiv.classList.add("row mx-0");
  firstDiv.setAttribute("class", "row mx-0 border-bottom");
  firstDiv.setAttribute("style", "height:80px;");
  firstDiv.setAttribute("id", "temp");//info.id
  document.getElementById('video_div').appendChild(firstDiv);

  make_firstChild(firstDiv, video_id);

  make_secondChild(firstDiv, video_id);

  make_thirdChild(firstDiv, video_id);

  make_progressDiv(video_id);


  //var t = document.createTextNode("this a paragraph");
  //btn.appendChild(t);

}

function extractId(url) {
  console.log('in extract id');
  var video_id = url.split('v=')[1];
  var ampersandPosition = video_id.indexOf('&');
  if (ampersandPosition != -1) {
    video_id = video_id.substring(0, ampersandPosition);
  }
  return video_id;
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
  div1.setAttribute("id", "progressDiv_" + video_id);
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

// folderIcon.addEventListener('click', function () {
//   console.log('file icon clicked');
//   ipcRenderer.send('open_file_directory');
// });


ipcRenderer.on('download-started', function (event, arg) {
  // const message = `Message reply: ${arg}`
  console.log(arg);
  document.getElementById('temp').id = arg.id ;
  showThumbNailAndName(arg);
  document.getElementById("processIcon_" + arg.id).style.display = "none";
  document.getElementById('downloadingIcon_' + arg.id).style.display = "inline";
  document.getElementById('folderIcon_' + arg.id).onclick = function () {
      ipcRenderer.send('open_file_directory',arg);
  }
  //status_text.innerHTML = "Downloading...";
  // status_text.style.color = "blue";
  //downloadProgress(arg._filename,arg.size);
  showBasicInfo(arg);
  downloadProgress(arg);
});

function showBasicInfo(info) {
  document.getElementById("processIcon_" + info.id).style.display = "none";
  document.getElementById('filesize_' + info.id).innerHTML = "Size(KB):" + info.size;
  document.getElementById('duration_' + info.id).innerHTML = "Duration(h:m:s:):" + info._duration_hms;
  document.getElementById('filename_' + info.id).innerHTML = "Filename:" + info._filename;
}

function showProgressBar() {
  var progBar = document.getElementById('progress_bar');
  progBar.style.display = "block";
}

function getFileSize(file) {
  console.log('file to get size:' + file);
  const stats = fs.statSync(file);
  const fileSizeInBytes = stats.size;
  //Convert the file size to megabytes (optional)
  //const fileSizeInMegabytes = fileSizeInBytes / 1000000.0;
  return fileSizeInBytes;
}

function downloadProgress(info) {
  var downloadedSize;
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
    console.log(downloadedSize);
    if (downloadedSize == info.size) {
      ipcRenderer.send('download-complete', info);
      clearInterval(progress);
      progressDiv.style.display = "none";
    }
  }, 500);
}

ipcRenderer.on('move-complete', (event, arg) => {
  console.log('move completed');
  document.getElementById('downloadingIcon_' + arg.id).style.display = "none";
  document.getElementById('folderIcon_' + arg.id).style.display = "inline-block";

});

function move(oldPath, newPath, callback) {
  console.log("new path:");
  console.log(newPath);
  var dir = newPath.substr(0, newPath.lastIndexOf(path.sep));
  console.log("last index:" + newPath.lastIndexOf(path.sep));
  console.log("new path:" + dir);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  fs.rename(oldPath, newPath, function (err) {
    if (err) {
      if (err.code === 'EXDEV') {
        copy();
      } else {
        callback(err);
      }
      return;
    }
  });

  function copy() {
    var readStream = fs.createReadStream(oldPath);
    var writeStream = fs.createWriteStream(newPath);

    readStream.on('error', callback);
    writeStream.on('error', callback);

    readStream.on('close', function () {
      fs.unlink(oldPath, callback);
    });

    readStream.pipe(writeStream);
  }
}



ipcRenderer.on('download_error', function () {

  status_text.innerHTML = "Error when downloading";
  processIcon.style.display = "none";
  downloadBtn.style.display = "inline-block";
});

//already_downloaded

ipcRenderer.on('already_downloaded', function (event,info) {
  status_text.innerHTML = "File already exist";
  status_text.style.color = "green";
  var exitingEle = document.getElementById('temp');
  document.getElementById('video_div').removeChild(exitingEle);
  setTimeout(() => {
    //status_text.innerHTML = "";
    fadeOut('error_text',9);
  }, 4000);
  document.getElementById('video_div').removeChild(document.getElementById("temp"));
  //document.getElementById(info.id).style.display = "none";
  downloadBtn.style.display = "inline-block";
});

ipcRenderer.on('already_downloadeding', function(event,info){
  var exitingEle = document.getElementById('temp');
  document.getElementById('video_div').removeChild(exitingEle);
  status_text.innerHTML = "File already in process";
  status_text.style.color = "green";
  setTimeout(() => {
    //status_text.innerHTML = "";
    fadeOut('error_text',9);
  }, 4000);
  document.getElementById('video_div').removeChild(document.getElementById("temp"));
  //document.getElementById(info.id).style.display = "none";
  downloadBtn.style.display = "inline-block";
});

// ipcRenderer.on('download-complete', function () {
//   console.log("download completed message come:");
//   downloadingIcon.style.display = "none";
//   folderIcon.style.display = "inline-block";
//   status_text.innerHTML = "Download completed";
//   status_text.style.color = "green";
// });

// ipcRenderer.on('downloaded-thumbnail', function (event, thumbnailName) {
//   console.log("downloaded thumbnail from index.js file:");
//   showThumbNailAndName(thumbnailName);
//   ipcRenderer.send('download_video');
// });
//filesize,ext,_duration_hms,_filename,size,fulltitle
function clear_status() {
  status_text.innerHTML = "";
  if (downloadBtn.style.display == "none") {
    downloadBtn.style.display = "inline-block";
    processIcon.style.display = "none";
  }
}

function isValidUrl(url) {
  var p = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
  if (url.match(p) != null) {
    //return url.match(p)[1];
    return true;
  }
  return false;
}

ipcRenderer.on('update_downloaded', function () {
  console.log("update-downloaded");
  document.getElementById("update-bar").style.display = "block";
  fadeIn("update-bar", 0);
});
