
export class Item {
    public url: string = "";
    public id: string = "";
    public isPlaylist: boolean = false;
    public infoAtLoad: VideoInfo = null;
    public infoAtDownload: VideoInfo = null;
    public folderName: string = "";
    public destinationDir: string = "";
    public list: string[] = null;
    public playlistId: string = "";
    public loadIndex: number = -1;
    public downloadIndex: number = -1;
    public downloadProgress: number = 0;
    public listSize: number = -1;
}

export interface VideoInfo {
    _filename: string;
    filesize: number;
    thumbnail: string;
    id: string;
    _duration_hms: string;

}