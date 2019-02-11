const ipcRenderer = require('electron').ipcRenderer;
        // wait for an updateReady message
const downloadBtn = document.getElementById('downloadBtn');
const urlField = document.getElementById('urlField');



downloadBtn.addEventListener('click', function(){
    console.log('download button clicked');
    var url = urlField.value;
    console.log("Url:"+url);
    ipcRenderer.send('start_download',url);
    
});


ipcRenderer.on('async-message-reply', function (event, arg) {
  const message = `Message reply: ${arg}`
  console.log(message);
});
