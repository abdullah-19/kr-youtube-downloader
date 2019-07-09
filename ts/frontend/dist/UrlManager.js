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
        let pattern = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|playlist\?list=))((\w|-))(?:\S+)?$/;
        if (url.match(pattern))
            return true;
        return false;
    }
    printSomething() {
        console.log('something printed');
    }
}
