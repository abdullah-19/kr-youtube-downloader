const ipcRenderer = require('electron').ipcRenderer;
        // wait for an updateReady message
const downloadBtn = document.getElementById('downloadBtn');
const urlField = document.getElementById('urlField');
const processIcon = document.getElementById('processIcon');
const fileIcon = document.getElementById('fileIcon');
const status_text = document.getElementById('error_text');


downloadBtn.addEventListener('click', function(){
    console.log('download button clicked');
    var url = urlField.value;
    if(url == ""){
      //console.log("empty url");
      status_text.innerHTML = "Please insert url";
    }
    else if(!isValidUrl(url)){
      status_text.innerHTML = "Url is not valid";
    }
    else{
      ipcRenderer.send('start_download',url);
    }
    console.log("Url:"+url);
});

fileIcon.addEventListener('click', function(){
  console.log('file icon clicked');
  ipcRenderer.send('open_file_directory');
});


ipcRenderer.on('download-started', function (event, arg) {
 // const message = `Message reply: ${arg}`
  downloadBtn.style.display = "none";
  processIcon.style.display = "inline-block";
  status_text.innerHTML = "Downloading...";
  status_text.style.color="blue";
});

ipcRenderer.on('download_error', function () {
  
  status_text.innerHTML="Error when downloading";
  processIcon.style.display = "none";
  downloadBtn.style.display = "inline-block";
});

//already_downloaded

ipcRenderer.on('already_downloaded', function () {
  status_text.innerHTML="File already exist";
  status_text.style.color = "green";
  processIcon.style.display = "none";
  downloadBtn.style.display = "inline-block";
});

ipcRenderer.on('download-complete', function () {
  console.log("download completed message come:");
  processIcon.style.display = "none";
  fileIcon.style.display = "inline-block";
  status_text.innerHTML = "Download completed";
  status_text.style.color = "green";
});

function clear_status(){
  status_text.innerHTML = "";
  if( downloadBtn.style.display == "none"){
    downloadBtn.style.display = "inline-block";
    processIcon.style.display = "none";
    fileIcon.style.display = "none";
  }
}

function isValidUrl(url) {
  var p = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
  if(url.match(p)!=null){
      //return url.match(p)[1];
      return true;
  }
  return false;
}