const ipcRenderer = require('electron').ipcRenderer;
        // wait for an updateReady message
const downloadBtn = document.getElementById('downloadBtn');
const urlField = document.getElementById('urlField');
const processIcon = document.getElementById('processIcon');
const fileIcon = document.getElementById('fileIcon');




downloadBtn.addEventListener('click', function(){
    console.log('download button clicked');
    var url = urlField.value;
    console.log("Url:"+url);
    ipcRenderer.send('start_download',url);
    
});

fileIcon.addEventListener('click', function(){
  console.log('file icon clicked');
  ipcRenderer.send('open_file_directory');
});


ipcRenderer.on('download-started', function (event, arg) {
  const message = `Message reply: ${arg}`
  console.log(message);
  downloadBtn.style.display = "none";
  processIcon.style.display = "inline-block";
});

ipcRenderer.on('download-complete', function () {
  console.log("download completed message come:");
  processIcon.style.display = "none";
  fileIcon.style.display = "inline-block";
});
