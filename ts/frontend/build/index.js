"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UrlManager_1 = require("./UrlManager");
var Main = /** @class */ (function () {
    function Main() {
        this.downloadBtn = document.getElementById('downloadBtn');
        this.urlField = document.getElementById('urlField');
        this.urlManager = new UrlManager_1.UrlManager();
        this.init();
    }
    Main.prototype.init = function () {
        var _this = this;
        this.downloadBtn.addEventListener('click', function () {
            _this.start_process();
        });
    };
    Main.prototype.start_process = function () {
        console.log('---starting process---');
        var url = this.urlField.value;
        url = url.trim();
        if (this.urlManager.isValidUrl(url))
            console.log('valid url');
        else
            console.log('not valid url');
    };
    return Main;
}());
new Main();
