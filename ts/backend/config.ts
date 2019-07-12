import { app } from "electron";
import path = require("path");


class Configuration {
    private loggerPath = __dirname;
    private readonly destinationDir = path.join(app.getPath('videos'), "kr_youtube_downloader");
    private readonly downloadDir = path.join(this.destinationDir, ".metadata");
    private readonly htmlPath = path.resolve(__dirname, "..", "ts/frontend/index.html");

    public configure(){
        let config = {
            "logger": {
              "level": "debug",
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

const index = process.argv.indexOf('--debug');
if (index === -1) {
  var prod = require('./config-production');
  config = { ...config, ...prod };
}
export default config;