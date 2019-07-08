const log = require('./Logger');

module.exports = class Url {

    getUrlFromId(id) {
        return "https://www.youtube.com/watch?v=" + id;
    }

    getIdFromUrl(url) {
        log.debug('-----getIdFromUrl----');
        var video_id = url.split('v=')[1];
        var ampersandPosition = video_id.indexOf('&');
        if (ampersandPosition != -1) {
            video_id = video_id.substring(0, ampersandPosition);
        }
        return video_id;
    }

    is_playlist(url) {
        var p = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|playlist\?list=))((\w|-))(?:\S+)?$/;
        if (url.match(p) != null) {
            return true;
        }
        return false;
    }

    getPlaylistId(url){
        log.debug('-----getIdFromUrl----');
        var playlist_id = url.split('list=')[1];
        log.debug('playlistId:'+playlist_id);
        return playlist_id;
    }

    getPlaylistLoadItemURL(item){
        return this.getUrlFromId(JSON.parse(item.list[item.loadIndex]).id);
    }
}