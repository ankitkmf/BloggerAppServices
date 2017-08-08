'use strict'
var bunyan = require('bunyan');
var fs = require("fs");
var config = require("config");

module.exports = (config) => {

    console.log("logs");

    const logDir = 'logs';
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir);
    }
    return {
        log: bunyan.createLogger({
            name: 'BMS',
            streams: [{
                    level: 'info',
                    path: config.getLog.getInfoFolderPath()
                },
                {
                    level: 'error',
                    path: config.getLog.getErrorFolderPath()
                        // type: 'rotating-file',
                        // path: config.getLog.getErrorFolderPath(),
                        // period: '1d', // daily rotation 
                        // count: 3
                }
            ]
        })
    }
}