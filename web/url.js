
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
        return 1;
    }
    else if (is_playlist(url)) return 2;
    return -1;
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