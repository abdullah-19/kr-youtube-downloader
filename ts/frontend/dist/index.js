"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UrlManager_1 = require("./UrlManager");
class Main {
    constructor() {
        this.downloadBtn = document.getElementById('downloadBtn');
        this.urlField = document.getElementById('urlField');
        this.urlManager = new UrlManager_1.UrlManager();
        this.init();
    }
    init() {
        this.downloadBtn.addEventListener('click', () => {
            this.start_process();
        });
    }
    start_process() {
        console.log('---starting process---');
        let url = this.urlField.value;
        url = url.trim();
        if (this.urlManager.isValidUrl(url))
            console.log('valid url');
        else
            console.log('not valid url');
    }
}
new Main();
//# sourceMappingURL=index.js.map