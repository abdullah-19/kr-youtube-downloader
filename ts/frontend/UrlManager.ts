import { Item } from "./Item";

export class UrlManager {
    public isValidUrl(url: string): boolean {
        let pattern: RegExp = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
        if (url.match(pattern)) return true;
        if (this.isPlaylist(url)) return true;
        return false;
    }

    public isPlaylist(url: string): boolean {
        console.log('--isPlaylist--');
        let pattern: RegExp = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|playlist\?list=))((\w|-))(?:\S+)?$/;
        if (url.match(pattern)) return true;
        return false;

    }

    public getPlaylistId(url: string): string {
        console.log('-----getPlaylistId----');
        let playlist_id: string = url.split('list=')[1];
        console.log('playlistId:' + playlist_id);
        return playlist_id;
    }

    public getIdFromUrl(url: string): string {
        console.log('---getIdFromUrl---');
        let video_id:string = url.split('v=')[1];
        let ampersandPosition:number = video_id.indexOf('&');
        if (ampersandPosition != -1) {
            video_id = video_id.substring(0, ampersandPosition);
        }
        return video_id;
    }

    public getPlaylistLoadItemId(item:Item):string{
        return JSON.parse(item.list[item.loadIndex]).id;
    }
    
    public getPlaylistDownloadItemId(item:Item):string{
        return JSON.parse(item.list[item.downloadIndex]).id;
    }
}
