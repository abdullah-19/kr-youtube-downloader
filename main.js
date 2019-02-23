const { app, BrowserWindow, ipcMain, shell } = require('electron');
const { autoUpdater } = require("electron-updater");
const path = require('path')
const url = require('url')
const exec = require('child_process').exec;
var fetchVideoInfo = require('youtube-info');
var fs = require('fs');
var youtubedl = require('youtube-dl');
var videoInfo;

let win;
let outputLines;
var video_url;
var download_path = path.join("\"" + app.getPath('videos') + "\"", "myDownloader", "%(title)s.%(ext)s");
var destination_path;
var downloadFileName;
var isWindowClosed = false;
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

  // win.on('close', event =>{
  //   event.preventDefault();
  //   win.hide();
  //   isWindowClosed = true;
  // });
  console.log('window created');
}


app.on('ready', () => {
  createWindow();
  checkUpdate();
});

app.on('window-all-closed', () => {

  if (process.platform !== 'darwin') {
    if (win === null) console.log("win value = null");
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
  //getVideoInfo();
  downloadUsingYDL();
  //download_thumbnail(event, video_url);
})

function downloadUsingYDL() {
  var filename;

  var video = youtubedl('https://www.youtube.com/watch?v=LIJAsKCLTqc',
    // Optional arguments passed to youtube-dl.
    ['--format=18'],//"%(title)s.%(ext)s"
    // Additional options can be given for calling `child_process.execFile()`.
    { cwd: __dirname });

  // Will be called when the download starts.
  video.on('info', function (info) {
    // console.log('Download started');
    // console.log('filename: ' + info._filename);
    // console.log('size: ' + info.size);
    videoInfo = info;
    console.log(info);
    console.log('thumbnail url:'+info.thumbnails[0].url);
    filename = info._filename;
    video.pipe(fs.createWriteStream("downloads/" + filename));
   // downloadProgress(filename, info.size);
    win.webContents.send('download-started',info);
  });

  //video.pipe(fs.createWriteStream('myvideo.mp4'));

}

function getFileSize(file) {
  console.log('file to get size:' + file);
  const stats = fs.statSync("downloads/" + file);
  const fileSizeInBytes = stats.size;
  //Convert the file size to megabytes (optional)
  //const fileSizeInMegabytes = fileSizeInBytes / 1000000.0;
  return fileSizeInBytes;
}

function downloadProgress(fileName, totalSize) {
  var downloadedSize;
  var progress = setInterval(() => {
    downloadedSize = getFileSize(fileName);
    console.log(downloadedSize);
    if (downloadedSize == totalSize) {
      move("downloads/" + fileName, path.join(app.getPath('videos'), "kr_youtube_downloader", fileName), (err) => {
        console.log(err);
      });
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

ipcMain.on('download-complete', ()=>{
  move("downloads/" + videoInfo._filename, path.join(app.getPath('videos'), "kr_youtube_downloader", videoInfo._filename), (err) => {
    console.log(err);
  });
});

function getVideoInfo() {
  fetchVideoInfo("QohH89Eu5iM", function (err, videoInfo) {
    if (err) throw new Error(err);
    console.log(videoInfo);
  });
}

ipcMain.on('download_video', function (event) {
  download_video(event, video_url);
})

function download_thumbnail(event, url) {
  var command = preperCommandForThumbnail(url);
  execute(command, (output, error) => {
    if (error != null) {
      console.log('thumbnail eror');
      event.sender.send('download_error');
    }

    else {
      console.log('thumbnail download success');
      console.log(output);
      var thumbnail_destination = output.split("Writing thumbnail to")[1].split("\n")[0];
      var thumbailDestinationWithoutExtension = thumbnail_destination.substr(0, thumbnail_destination.lastIndexOf('.'));
      var thumbnailName = thumbailDestinationWithoutExtension.substr(thumbailDestinationWithoutExtension.lastIndexOf
        (path.sep) + 1, thumbailDestinationWithoutExtension.length - 1);

      console.log('thumbnail destination:' + thumbnail_destination);
      console.log('thumbnail name:' + thumbnailName);
      event.sender.send('downloaded-thumbnail', thumbnailName);

    }

  });
}

function download_video(event) {

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

function preperCommandForThumbnail(url) {
  var plugin_path = path.join("\"" + __dirname + "\"", "downloads", "youtube-dl");
  var thumbnail_path = path.join("\"" + __dirname + "\"", "downloads", "thumbnail", "%(title)s");
  var command;

  //console.log("download_path:" + download_path);

  if (url.indexOf("playlist?list=") != -1) {
    command = plugin_path + " -i -f mp4 --yes-playlist -o " + download_path + " " + url;
    return command;
  }
  else {
    console.log("splitted Link:" + url.split("&")[0]);
    command = plugin_path + " --skip-download --write-thumbnail" + " -o " + thumbnail_path + " " + url.split("&")[0];
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
  try {
    autoUpdater.checkForUpdates();
  } catch (err) {
    console.log('some error in update checking');
  }

}