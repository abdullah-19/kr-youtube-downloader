"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UrlManager = /** @class */ (function () {
    function UrlManager() {
    }
    UrlManager.prototype.isValidUrl = function (url) {
        var pattern = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
        if (url.match(pattern))
            return true;
        if (this.isPlaylist(url))
            return true;
        return false;
    };
    UrlManager.prototype.isPlaylist = function (url) {
        var pattern = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|playlist\?list=))((\w|-))(?:\S+)?$/;
        if (url.match(pattern))
            return true;
        return false;
    };
    return UrlManager;
}());
exports.UrlManager = UrlManager;
