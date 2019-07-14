import log, { IElectronLog, ILevelOption } from 'electron-log';
import path = require('path');
import config from './config';

class Logger {
    private projectPath: string = config.logger.path;

    public configure():IElectronLog {
        
        log.transports.file.file = path.join(this.projectPath, config.logger.filename);
        log.transports.file.level = <ILevelOption>config.logger.level;
        log.transports.file.maxSize = config.logger.size || 5 * 1024 * 1024;  //5MB

        process.on('uncaughtException', function (error) {
            log.error('an unhandled error caught in gloabl handler: ', error);
        });

        log.debug('logging set up');
        log.debug('log level:' + config.logger.level);
        log.debug('size:' + log.transports.file.maxSize);
        return log;
    }

}

let Log =  new Logger().configure();
export default Log;