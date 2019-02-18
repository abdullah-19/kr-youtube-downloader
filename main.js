const { app, BrowserWindow, ipcMain, shell } = require('electron');
const { autoUpdater } = require("electron-updater");
const path = require('path')
const url = require('url')
const exec = require('child_process').exec;

let win;
let outputLines;
var video_url;
var download_path = path.join("\"" + app.getPath('videos') + "\"", "myDownloader", "%(title)s.%(ext)s");
var destination_path;
var downloadFileName;
function createWindow() {

  win = new BrowserWindow({ width: 800, height: 600 })

  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));


  win.on('closed', () => {
    win = null
  });
}

app.on('ready', () => {
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

ipcMain.on('start_download', function (event, arg) {
  video_url = arg;
  download_thumbnail(event,video_url);
})

ipcMain.on('download_video', function (event) {
  download_vidoe(event,video_url);
})

function download_thumbnail(event,url) {
  var command = preperCommandForThumbnail(url);
  execute(command,(output,error) => {
    if (error != null) {
      console.log('thumbnail eror');
      event.sender.send('download_error');
    }

    else {
      console.log('thumbnail download success');
      console.log(output);
       var thumbnail_destination = output.split("Writing thumbnail to")[1].split("\n")[0];
       var thumbailName = thumbnail_destination.substr(0, thumbnail_destination.lastIndexOf('.'));
        console.log('thumbnail destination:'+thumbnail_destination);
        console.log('thumbnail name'+thumbailName);
        // var splitted_words = thumbnail_destination.split(path.sep);
        // var thumbnailName = splitted_words[splitted_words.length - 1];
        // var nameAndExtenstion = thumbnailName.split(".jpg");
        // var onlyName = nameAndExtenstion[0];
        // console.log('only name'+onlyName);
        event.sender.send('downloaded-thumbnail',thumbailName);

    }

  });
}

function download_vidoe(event) {

  console.log("in ipcMain:" + video_url);
  var command = preperCommand(video_url);
  execute(command, (output, error) => {
    if (error != null) {
      event.sender.send('download_error');
    }
    else {
      console.log(output);
      if (output.indexOf("Destination:") != -1) {
        destination_path = output.split("Destination:")[1].split("\n")[0];
        var splitted_words = destination_path.split(path.sep);
        downloadFileName = splitted_words[splitted_words.length - 1];
        console.log("fileName:" + downloadFileName);
        console.log("destination folder:" + destination_path);
        event.sender.send('download-complete');
      }
      else if (output.indexOf("has already been downloaded") != -1) {
        event.sender.send('already_downloaded');
      }

    }

  });
  event.sender.send('download-started', 'Download not completed');

}

ipcMain.on('open_file_directory', function () {
  var downloadedFile_path = path.join(app.getPath('videos'), "myDownloader", downloadFileName);
  console.log("downloaded file path:" + downloadedFile_path);
  //shell.showItemInFolder(app.getPath('videos')+"/myDownloader/"+"\""+downloadFileName+"\"");
  shell.showItemInFolder(downloadedFile_path);
})

function showStatus(output) {
  setInterval(function () {
    console.log(output);
  }, 1000);
}


// ipcMain.on("startDownload", () => {
//     var command = preperCommand();
//     execute('ping www.google.com', (output) => {
//       console.log(output);
//     });
// });

function preperCommand(url) {
  var plugin_path = path.join("\"" + __dirname + "\"", "downloads", "youtube-dl");
  var command;

  console.log("download_path:" + download_path);

  if (url.indexOf("playlist?list=") != -1) {
    command = plugin_path + " -i -f mp4 --yes-playlist -o " + download_path + " " + url;
    return command;
  }
  else {
    console.log("splitted Link:" + url.split("&")[0]);
    command = plugin_path + " -o " + download_path + " " + url.split("&")[0];
    console.log("command:" + command);
    return command;
  }
}

function preperCommandForThumbnail(url){
  var plugin_path = path.join("\"" + __dirname + "\"", "downloads", "youtube-dl");
  var thumbnail_path = path.join("\"" + __dirname + "\"", "downloads","thumbnail","%(title)s");
  var command;

  //console.log("download_path:" + download_path);

  if (url.indexOf("playlist?list=") != -1) {
    command = plugin_path + " -i -f mp4 --yes-playlist -o " + download_path + " " + url;
    return command;
  }
  else {
    console.log("splitted Link:" + url.split("&")[0]);
    command = plugin_path +" --skip-download --write-thumbnail" +" -o " + thumbnail_path + " " + url.split("&")[0];
    console.log("thumbnail command:" + command);
    return command;
  }
}

function execute(command, callback) {
  exec(command, (error, stdout, stderr) => {
    callback(stdout, error);
  });
};

autoUpdater.on('update-downloaded', (info) => {
  win.webContents.send('update_downloaded');
});

ipcMain.on("install-update", () => {
  console.log("has come to install-update");
  autoUpdater.quitAndInstall();
});

function checkUpdate() {
  autoUpdater.checkForUpdates();
}