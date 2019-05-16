//item means a download item in queue. it may a single video or a playlist

const log = require('./Logger');

module.exports = class Item{
    constructor() {
        this.url = "";
        this.id = "";
        this.isPlayliist= false;
        this.infoAtLoad = null;
        this.infoAtDownload = null;
        this.folderName = "";
        this.destinationPath = "";
        this.list = null;
        this.playlistId = "";
        this.loadIndex= 0;
        this.downloadIndex = 0;
        log.debug('------in Item class constuctor-----');

    }
}