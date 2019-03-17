const { app, BrowserWindow, ipcMain, shell } = require('electron');
const { autoUpdater } = require("electron-updater");
const path = require('path')
const url = require('url')
const exec = require('child_process').exec;
var fetchVideoInfo = require('youtube-info');
var fs = require('fs');
var youtubedl = require('youtube-dl');
//require('electron-reload')(__dirname);


var videoInfo;
let win;
let outputLines;
//var video_url;
var download_path = path.join("\"" + app.getPath('videos') + "\"", "myDownloader", "%(title)s.%(ext)s");
var destination_folder = path.join(app.getPath('videos'), "kr_youtube_downloader");
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

ipcMain.on('start_playlist_download', function (event, arg) {
 // console.log('come to main.js');
 // video_url = arg;
  //download_playlist(video_url);
  download_videoList(arg);
})

function download_videoList(url){
  youtubedl.exec(url, ['-j', '--flat-playlist'], {}, function(err, output) {
    if (err) throw err;
    //console.log(output.join('\n'));
    var myObject = JSON.parse(output[0]);
    // console.log('length:'+output.length);
    // console.log('firs elem:'+myObject.id);
    win.webContents.send('video-list', output);
    //console.log('type of first elem:'+ (typeof output[0]));

  });
}

// function download_playlist(url) {

//   var video = youtubedl(url);

//   video.on('error', function error(err) {
//     console.log('error 2:', err);
//   });
//   //console.log(video);
//   win.webContents.send('playlist_info',video);
//   var size = 0;
//   video.on('info', function (info) {
//     console.log('playlist info:');
//    // console.log(info);
//     size = info.size;
//     var output = path.join(__dirname + '/', size + '.mp4');
//     video.pipe(fs.createWriteStream(output));
//   });

//   var pos = 0;
//   video.on('data', function data(chunk) {
//     pos += chunk.length;
//     // `size` should not be 0 here.
//     if (size) {
//       var percent = (pos / size * 100).toFixed(2);
//       //  process.stdout.cursorTo(0);
//       //  process.stdout.clearLine(1);
//       //  process.stdout.write(percent + '%');
//       //console.log('percent:'+percent+'%');
//     }
//   });

//   video.on('next', download_playlist);
//   //playlist('https://www.youtube.com/playlist?list=PLEFA9E9D96CB7F807');
// }

ipcMain.on('start_download', function (event, arg) {
 // video_url = arg;
  downloadUsingYDL(arg);
})

ipcMain.on('download-playlist-item',function(event,playlist){
  
})



function downloadUsingYDL(url) {
  var filename;
  var downloadPath;
  console.log('in downloadUsingYDL');
  console.log(url);

  var video = youtubedl(url,
    ['--format=18'],//"%(title)s.%(ext)s"
    { cwd: __dirname });

  video.on('info', function (info) {
    if (fs.existsSync(path.join(destination_folder, info._filename))) {
      win.webContents.send('already_downloaded', info);
    }
    else if (fs.existsSync(path.join(app.getAppPath(), "downloads", info._filename))) {
      win.webContents.send('already_downloadeding', info);
    }
    else {
      videoInfo = info;
      console.log(info);
      console.log('thumbnail url:' + info.thumbnails[0].url);
      filename = info._filename;
      downloadPath = path.join(app.getAppPath(), "downloads", filename);
      video.pipe(fs.createWriteStream(downloadPath));
      //fs.createWriteStream("downloads/" + filename));
      info.appPath = app.getAppPath();
      info.downloadFilePath = downloadPath;
      console.log('download path:');
      console.log(info.appPath);
      win.webContents.send('download-started', info);
    }
  });


}

function getFileSize(file) {
  console.log('file to get size:' + file);
  const stats = fs.statSync("downloads/" + file);
  const fileSizeInBytes = stats.size;
  //Convert the file size to megabytes (optional)
  //const fileSizeInMegabytes = fileSizeInBytes / 1000000.0;
  return fileSizeInBytes;
}

// function downloadProgress(fileName, totalSize) {
//   var downloadedSize;
//   var progress = setInterval(() => {
//     downloadedSize = getFileSize(fileName);
//     console.log(downloadedSize);
//     if (downloadedSize == totalSize) {
//       move("downloads/" + fileName, path.join(app.getPath('videos'), "kr_youtube_downloader", fileName), (err) => {
//         console.log(err);
//       });
//       clearInterval(progress);
//     }
//   }, 2000);
// }

function move(oldPath, newPath, info, callback) {
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
        win.webContents.send('move-complete', info);
      } else {
        callback(err);
      }
      return;
    }
    else {
      win.webContents.send('move-complete', info);
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

ipcMain.on('download-complete', (event, info) => {
  move(info.downloadFilePath, path.join(app.getPath('videos'), "kr_youtube_downloader", info._filename), info, (err) => {
    console.log(err);
  });
});

function getVideoInfo() {
  fetchVideoInfo("QohH89Eu5iM", function (err, videoInfo) {
    if (err) throw new Error(err);
    console.log(videoInfo);
  });
}

// ipcMain.on('download_video', function (event) {
//   download_video(event, video_url);
// })

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

// function download_video(event) {

//   console.log("in ipcMain:" + video_url);
//   var command = preperCommand(video_url);
//   execute(command, (output, error) => {
//     if (error != null) {
//       event.sender.send('download_error');
//     }
//     else {
//       console.log(output);
//       if (output.indexOf("Destination:") != -1) {
//         destination_path = output.split("Destination:")[1].split("\n")[0];
//         var splitted_words = destination_path.split(path.sep);
//         downloadFileName = splitted_words[splitted_words.length - 1];
//         console.log("fileName:" + downloadFileName);
//         console.log("destination folder:" + destination_path);
//         event.sender.send('download-complete');
//       }
//       else if (output.indexOf("has already been downloaded") != -1) {
//         event.sender.send('already_downloaded');
//       }

//     }

//   });
//   event.sender.send('download-started', 'Download not completed');

// }

ipcMain.on('open_file_directory', function (event, info) {
  var downloadedFile_path = path.join(app.getPath('videos'), "kr_youtube_downloader", info._filename);
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
}

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