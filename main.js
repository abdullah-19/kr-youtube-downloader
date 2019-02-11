const {app, BrowserWindow, ipcMain} = require('electron');
// const electron = require("electron");
// const app = electron.app;
// const BrowserWindow = electron.BrowserWindow;
//const {app, BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')
const exec = require('child_process').exec;


let win;

function createWindow () {

  win = new BrowserWindow({width: 800, height: 600})

  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));


  win.on('closed', () => {
    win = null
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});

ipcMain.on('start_download', function (event, url) {
  console.log("in ipcMain:"+url);
  var command = preperCommand(url);
  execute(command, (output) => {
      console.log(output);
  });

  event.sender.send('async-message-reply', 'Download completed');
})


ipcMain.on("startDownload", () => {
    //var para = document.getElementById('myP');
    var command = preperCommand();
    execute('ping www.google.com', (output) => {
     // para.innerHTML= output;
      console.log(output);
    });
});

function preperCommand(url){
  var download_path = path.join(__dirname,"downloads","youtube-dl");
  console.log("download_path:"+download_path);

  if(url.indexOf("playlist?list=") != -1) return download_path + " -i -f mp4 --yes-playlist "+url;
  else if(url.indexOf("watch?v=") != -1){
      console.log("splitted Link:"+url.split("&")[0]);
      return download_path+" "+url.split("&")[0];
  }
}

function execute(command, callback) {
    exec(command, (error, stdout, stderr) => { 
        callback(stdout); 
    });
};

// call the function

