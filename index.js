const fs = require('fs');
const path = require('path');
const ipcRenderer = require('electron').ipcRenderer;
// wait for an updateReady message
const downloadBtn = document.getElementById('downloadBtn');
const urlField = document.getElementById('urlField');
const processIcon = document.getElementById('processIcon');
const fileIcon = document.getElementById('fileIcon');
const status_text = document.getElementById('error_text');
const update_button = document.getElementById('updateBtn');
const closeIcon = document.getElementById('closeIcon');
const downloadingIcon = document.getElementById('downloadingIcon');


function showThumbNailAndName(name,thumb_url) {
  console.log("video name:" + name);
  var thumbnail = document.getElementById("videoThumbnail");
  //thumbnail.src = "downloads/thumbnail/" + name + ".jpg";
  thumbnail.src = thumb_url;
  thumbnail.style.display = "inline";
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
  console.log('download button clicked');

  downloadBtn.style.display = "none";
  document.getElementById('video_div').style.display = "block";
  processIcon.style.display = "inline-block";
  var url = urlField.value;

  status_text.innerHTML = "Processing..";
  if (url == "") {
    status_text.innerHTML = "Please insert url";
  }
  else if (!isValidUrl(url)) {
    status_text.innerHTML = "Url is not valid";
  }
  else {
    ipcRenderer.send('start_download', url);
  }

  ipcRenderer.send('start_download', url);  
  console.log("Url:" + url);
});

fileIcon.addEventListener('click', function () {
  console.log('file icon clicked');
  ipcRenderer.send('open_file_directory');
});


ipcRenderer.on('download-started', function (event, arg) {
  // const message = `Message reply: ${arg}`
  //console.log(arg);
  showThumbNailAndName(arg._filename,arg.thumbnails[0].url);
  processIcon.style.display = "none";
  downloadingIcon.style.display = "inline";
  status_text.innerHTML = "Downloading...";
  status_text.style.color = "blue";
  //downloadProgress(arg._filename,arg.size);
  showBasicInfo(arg);
  downloadProgress(arg);
});

function showBasicInfo(info){
    document.getElementById('filesize').innerHTML =  "Size(KB):"+info.size;
    document.getElementById('duration').innerHTML = "Duration(h:m:s:):"+info._duration_hms;
    document.getElementById('filename').innerHTML = "Filename:"+info._filename;
}

function showProgressBar(){
  var progBar = document.getElementById('progress_bar');
  progBar.style.display = "block";

}

function getFileSize(file) {
  console.log('file to get size:' + file);
  const stats = fs.statSync("downloads/" + file);
  const fileSizeInBytes = stats.size;
  //Convert the file size to megabytes (optional)
  //const fileSizeInMegabytes = fileSizeInBytes / 1000000.0;
  return fileSizeInBytes;
}

function downloadProgress(info) {
  var downloadedSize;
  document.getElementById('progress_div').style.display = "block";
  var progressStatus = document.getElementById('progress');
 // var parentOfProgressBar = document.getElementById("parentOfprogressBar");
  var progressBar = document.getElementById('progress_bar');
  progressBar.style.display = "block";
  var parcentOfProgress;
  var parecentStr;
  var progress = setInterval(() => {
    downloadedSize = getFileSize(info._filename);
    parcentOfProgress = downloadedSize/info.size;
    parcentOfProgress = parcentOfProgress*100;
    progressBar.style.width = parcentOfProgress+"%"; 
    progressStatus.innerHTML = Math.floor(parcentOfProgress)+"%";
    console.log(downloadedSize);
    if (downloadedSize == info.size) {
      ipcRenderer.send('download-complete');
      parentOfProgressBar.style.display = "none";
      clearInterval(progress);
    }
  }, 2000);
}

function move(oldPath, newPath, callback) {
  console.log("new path:");
  console.log(newPath);
  var dir = newPath.substr(0, newPath.lastIndexOf(path.sep));
  console.log("last index:"+newPath.lastIndexOf(path.sep));
  console.log("new path:"+dir);
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

ipcRenderer.on('already_downloaded', function () {
  status_text.innerHTML = "File already exist";
  status_text.style.color = "green";
  downloadingIcon.style.display = "none";
  downloadBtn.style.display = "inline-block";
});

ipcRenderer.on('download-complete', function () {
  console.log("download completed message come:");
  downloadingIcon.style.display = "none";
  fileIcon.style.display = "inline-block";
  status_text.innerHTML = "Download completed";
  status_text.style.color = "green";
});

ipcRenderer.on('downloaded-thumbnail', function (event, thumbnailName) {
  console.log("downloaded thumbnail from index.js file:");
  showThumbNailAndName(thumbnailName);
  ipcRenderer.send('download_video');
});
//filesize,ext,_duration_hms,_filename,size,fulltitle
function clear_status() {
  status_text.innerHTML = "";
  if (downloadBtn.style.display == "none") {
    downloadBtn.style.display = "inline-block";
    processIcon.style.display = "none";
    fileIcon.style.display = "none";
    var thumbnail = document.getElementById("videoThumbnail");
    thumbnail.style.display = "none";
    var videoName = document.getElementById("videoName");
    videoName.style.display = "none";
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
