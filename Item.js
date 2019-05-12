//item means a download item in queue. it may a single video or a playlist

const log = require('./Logger');

module.exports = class Item{
    constructor() {
        this.url = null;
        this.type= null;
        this.loadedInfo = null;
        this.folderName = null;
        this.list = null;
        this.loadIndex= null;
        this.downloadIndex = null;

    }
}