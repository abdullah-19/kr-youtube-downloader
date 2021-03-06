
function extractId(url) {
    console.log('in extract id');
    var video_id = url.split('v=')[1];
    var ampersandPosition = video_id.indexOf('&');
    if (ampersandPosition != -1) {
        video_id = video_id.substring(0, ampersandPosition);
    }
    return video_id;
}

function isValidUrl(url) {
    var p = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    if (url.match(p) != null) {
        //return url.match(p)[1];
        return true;
    }
    else if (is_playlist(url)) return true;
    return false;
}

function is_playlist(url) {
    var p = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|playlist\?list=))((\w|-))(?:\S+)?$/;
    if (url.match(p) != null) {
        return true;
    }
    return false;
}

function getUrlFromId(id) {
    return "https://www.youtube.com/watch?v=" + id;
}

function getPlaylistId(url){
    console.log('-----getPlaylistId----');
    var playlist_id = url.split('list=')[1];
    console.log('playlistId:'+playlist_id);
    return playlist_id;
}

function getPlaylistLoadItemId(item){
    return JSON.parse(item.list[item.loadIndex]).id;
}

function getPlaylistDownloadItemId(item){
    return JSON.parse(item.list[item.downloadIndex]).id;
}