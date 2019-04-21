const { ipcMain, shell } = require('electron');
const Url = require('./Url');
const youtubedl = require('youtube-dl');

module.exports = class Downloader {
    constructor(app, win) {
        this.app = app;
        this.win = win;
        this.url = new Url();
        this.setIpcEvents();
    }

    setIpcEvents() {
        this.setPlaylistDownloadEvent();
        this.setLoadEvent();
    }

    setLoadEvent() {
        ipcMain.on('start_load', function (event, info) {
            var url;
            console.log('in load');
            if (info.type === "playlist") {
                var id = JSON.parse(info.list[info.currentLoadItem]).id;
                url = this.url.getUrlFromId(id);
                info.url = url;
            }

            else if (info.type === "single") {
                url = info.url;
            }
            this.loadUsingYDL(info);

        })
    }

    loadUsingYDL(info) {
        var filename;
        var downloadPath;

        //var options = ['--username=user', '--password=hunter2'];
        var options = ['--format=18', '--skip-download'];
        youtubedl.getInfo(info.url, options, function (err, loadedInfo) {
            if (err) throw err;
            // console.log('from video info');
            // console.log('id:', loadedInfo.id);
            // console.log('title:', loadedInfo.title);
            // console.log('url:', loadedInfo.url);
            // console.log('thumbnail:', loadedInfo.thumbnail);
            // console.log('description:', loadedInfo.description);
            // console.log('filename:', loadedInfo._filename);
            // console.log('format id:', loadedInfo.format_id);
            // return info;


            info.loadedInfo = loadedInfo;

            if (fs.existsSync(path.join(destination_folder, loadedInfo._filename))) {
                this.win.webContents.send('already_downloaded', info);
            }
            else if (fs.existsSync(path.join(app.getAppPath(), "downloads", loadedInfo._filename))) {
                this.win.webContents.send('already_downloadeding', info);
            }
            else {
                videoInfo = loadedInfo;
                console.log('thumbnail url:' + loadedInfo.thumbnails[0].url);
                filename = loadedInfo._filename;
                downloadPath = path.join(app.getAppPath(), "downloads", filename);
                loadedInfo.appPath = app.getAppPath();
                loadedInfo.downloadFilePath = downloadPath;
                this.win.webContents.send('load-complete', info);
            }

        });
    }


    setPlaylistDownloadEvent() {
        ipcMain.on('start_playlist_download', function (event, arg) {
            this.download_videoList(arg);
        })
    }

    download_videoList(url) {
        youtubedl.exec(url, ['-j', '--flat-playlist'], {}, function (err, output) {
            if (err) throw err;
            var info = {};
            info.type = "playlist";
            info.folderName = "playlist:" + getDateTime();
            info.list = output;
            info.currentDownloadItem = 0;
            info.currentLoadItem = 0;
            this.win.webContents.send('video-list', info);
        });
    }

    downloadUsingYDL(info) {
        var filename;
        var downloadPath;
        //console.log('in downloadUsingYDL');
        //console.log(info);
        console.log('downlaod video url:' + info.url);

        var video = youtubedl(info.url,
            ['--format=18'],//"%(title)s.%(ext)s"
            { cwd: __dirname });

        video.on('info', function (loadedInfo) {
            info.loadedInfo = loadedInfo;

            if (fs.existsSync(path.join(destination_folder, loadedInfo._filename))) {
                win.webContents.send('already_downloaded', info);
            }
            else if (fs.existsSync(path.join(app.getAppPath(), "downloads", loadedInfo._filename))) {
                win.webContents.send('already_downloadeding', info);
            }
            else {
                videoInfo = loadedInfo;

                //console.log(info);
                console.log('thumbnail url:' + loadedInfo.thumbnails[0].url);
                filename = loadedInfo._filename;
                downloadPath = path.join(app.getAppPath(), "downloads", filename);
                video.pipe(fs.createWriteStream(downloadPath));
                //fs.createWriteStream("downloads/" + filename));
                loadedInfo.appPath = app.getAppPath();
                loadedInfo.downloadFilePath = downloadPath;
                //console.log('download path:');
                //console.log(info.appPath);
                win.webContents.send('download-started', info);
            }
        });

    }

    getDateTime() {
        var date = new Date();
        var time = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        var date = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
        return time + " " + date;
    }

    download_thumbnail(event, url) {
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

    preperCommand(url) {
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

    preperCommandForThumbnail(url) {
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

    execute(command, callback) {
        exec(command, (error, stdout, stderr) => {
            callback(stdout, error);
        });
    }
}