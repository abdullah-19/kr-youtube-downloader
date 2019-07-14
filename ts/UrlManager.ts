import log from "./Logger";
import { Item } from "./Item";

export class UrlManager {
    public getUrlFromId(id: string): string {
        return "https://www.youtube.com/watch?v=" + id;
    }

    public getIdFromUrl(url: string): string {
        log.debug('-----getIdFromUrl----');
        var video_id = url.split('v=')[1];
        var ampersandPosition = video_id.indexOf('&');
        if (ampersandPosition != -1) {
            video_id = video_id.substring(0, ampersandPosition);
        }
        return video_id;
    }

    public is_playlist(url: string): boolean {
        var p = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|playlist\?list=))((\w|-))(?:\S+)?$/;
        if (url.match(p) != null) {
            return true;
        }
        return false;
    }

    public getPlaylistId(url:string):string {
        log.debug('-----getIdFromUrl----');
        var playlist_id = url.split('list=')[1];
        log.debug('playlistId:' + playlist_id);
        return playlist_id;
    }

    public getPlaylistLoadItemURL(item:Item):string {
        return this.getUrlFromId(JSON.parse(item.list[item.loadIndex]).id);
    }

}