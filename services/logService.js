'use strict'
var bunyan = require('bunyan');
var fs = require("fs");
var config = require("config");

module.exports = (config) => {

    try {
        const logDir = 'logs';
        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir);
        }
        console.log(config.cache.expire);
        var logging = bunyan.createLogger({
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
        });
        console.log(config.messageList.infoList.msg_201.msg);
    } catch (err) {
        // var error = { error: "failed", error: err.message };
        // res.json({"error_code":});
    }
    return {
        log: logging
    }
}