"use strict";
class Item {
    constructor() {
        this.url = "";
        this.id = "";
        this.isPlaylist = false;
        this.infoAtLoad = null;
        this.infoAtDownload = null;
        this.folderName = "";
        this.destinationDir = "";
        this.list = null;
        this.playlistId = "";
        this.loadIndex = -1;
        this.downloadIndex = -1;
        this.downloadProgress = 0;
        this.listSize = -1;
    }
}
