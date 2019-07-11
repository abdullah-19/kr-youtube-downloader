"use strict";
class UrlManager {
    isValidUrl(url) {
        let pattern = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
        if (url.match(pattern))
            return true;
        if (this.isPlaylist(url))
            return true;
        return false;
    }
    isPlaylist(url) {
        console.log('--isPlaylist--');
        let pattern = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|playlist\?list=))((\w|-))(?:\S+)?$/;
        if (url.match(pattern))
            return true;
        return false;
    }
    getPlaylistId(url) {
        console.log('-----getPlaylistId----');
        let playlist_id = url.split('list=')[1];
        console.log('playlistId:' + playlist_id);
        return playlist_id;
    }
    getIdFromUrl(url) {
        console.log('---getIdFromUrl---');
        let video_id = url.split('v=')[1];
        let ampersandPosition = video_id.indexOf('&');
        if (ampersandPosition != -1) {
            video_id = video_id.substring(0, ampersandPosition);
        }
        return video_id;
    }
    getPlaylistLoadItemId(item) {
        return JSON.parse(item.list[item.loadIndex]).id;
    }
    getPlaylistDownloadItemId(item) {
        return JSON.parse(item.list[item.downloadIndex]).id;
    }
}
