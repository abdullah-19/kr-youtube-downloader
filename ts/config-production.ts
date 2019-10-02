import { app } from "electron";
import path = require("path");


class Configuration {
    private loggerPath = __dirname + '/../../';
    private readonly destinationDir = path.join(app.getPath('videos'), "kr_youtube_downloader");
    private readonly downloadDir = path.join(this.destinationDir, ".metadata");
    private readonly htmlPath = path.resolve(__dirname, "..", "frontend/index.html");

    public configure(){
        let config = {
            "logger": {
              "level": "info",
              "path": this.loggerPath,
              "size": 5 * 1024 * 1024,
              "filename": "log.txt"
            },
            "downloadDir":this.downloadDir,
            "destinationDir":this.destinationDir,
            "htmlPath":this.htmlPath,
            "isProduction": false
          };

          return config;
    }

}


let config = new Configuration().configure();
export default config;