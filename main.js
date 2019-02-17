const {app, BrowserWindow, ipcMain,shell} = require('electron');
const {autoUpdater} = require("electron-updater");
const path = require('path')
const url = require('url')
const exec = require('child_process').exec;

let win;
let outputLines;
var download_path = path.join("\""+app.getPath('videos')+"\"","myDownloader","%(title)s.%(ext)s");
var destination_path;
var downloadFileName;
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

app.on('ready',()=>{
  createWindow();
  checkUpdate();
});

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
  execute(command, (output,error) => {
      if(error != null){
        event.sender.send('download_error');
      }
      else{
        console.log(output);
        if(output.indexOf("Destination:") != -1){
          destination_path = output.split("Destination:")[1].split("\n")[0];
          var splitted_words = destination_path.split(path.sep);
          downloadFileName = splitted_words[splitted_words.length-1];
          console.log("fileName:"+downloadFileName);
          console.log("destination folder:"+destination_path);
          event.sender.send('download-complete');
        }
        else if(output.indexOf("has already been downloaded") != -1){
          event.sender.send('already_downloaded');
        }
        
      }
      
  });
  event.sender.send('download-started', 'Download not completed');
})

ipcMain.on('open_file_directory', function(){
  shell.showItemInFolder(app.getPath('videos')+"/myDownloader/"+downloadFileName);
})

function showStatus(output){
  setInterval(function(){
    console.log(output);
  }, 1000);
}


// ipcMain.on("startDownload", () => {
//     var command = preperCommand();
//     execute('ping www.google.com', (output) => {
//       console.log(output);
//     });
// });

function preperCommand(url){
  var plugin_path = path.join("\""+__dirname+"\"","downloads","youtube-dl");
  var command;
  
  console.log("download_path:"+download_path);

  if(url.indexOf("playlist?list=") != -1) {
    command = plugin_path + " -i -f mp4 --yes-playlist -o "+download_path+" "+url;
    return command;
  }
  else{
      console.log("splitted Link:"+url.split("&")[0]);
      command = plugin_path+" -o "+download_path+" "+url.split("&")[0];
      console.log("command:"+command);
      return command;
  }
}

function execute(command, callback) {
    exec(command, (error, stdout, stderr) => { 
        callback(stdout,error); 
    });
};

autoUpdater.on('update-downloaded', (info) => {
  win.webContents.send('update_downloaded');
});

ipcMain.on("install-update", () => {
  console.log("has come to install-update");
  autoUpdater.quitAndInstall();
});

function checkUpdate(){
  autoUpdater.checkForUpdates();
}