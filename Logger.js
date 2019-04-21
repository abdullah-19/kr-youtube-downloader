const log = require('electron-log');
const path = require('path');
const config = require('./config');
var projectPath = __dirname;

(function(){

    //if (config.isProduction) projectPath = __dirname + "/../../";
    projectPath = config.logger.path;

    log.transports.file.file = path.join(projectPath, config.logger.filename);
    // @ts-ignore
    log.transports.file.level = config.logger.level;
    
    
    log.transports.file.maxSize = config.logger.size || 5 * 1024 * 1024  ;  //5MB
    // setup a gloab error
    // @ts-ignore
    
    process.on('uncaughtException', function (error) {
        log.error('an unhandled error caught in gloabl handler: ', error);
    });
    
    log.debug('logging set up');
    log.debug('log level:' + config.log_level);
    log.debug('size:' + log.transports.file.maxSize);

})();


module.exports = log;