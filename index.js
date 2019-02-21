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


function showThumbNailAndName(name) {
  console.log("video name:" + name);
  var thumbnail = document.getElementById("videoThumbnail");
  thumbnail.src = "downloads/thumbnail/" + name + ".jpg";
  thumbnail.style.display = "inline";
  var videoName = document.getElementById("videoName");
  videoName.innerHTML = name + ".mp4";
  videoName.style.display = "block";

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
  processIcon.style.display = "none";
  downloadingIcon.style.display = "inline";
  status_text.innerHTML = "Downloading...";
  status_text.style.color = "blue";
});

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
