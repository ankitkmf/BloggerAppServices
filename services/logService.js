'use strict'
var bunyan = require('bunyan');
var fs = require("fs");

module.exports = (config) => {

    try {
        const logDir = 'logs';
        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir);
        }
        var logging = bunyan.createLogger({
            name: 'BMS',
            streams: [{
                    level: 'info',
                    path: config.getLog.getInfoFolderPath(),
                    type: 'rotating-file',
                    period: '1d', // daily rotation 
                    count: 3
                },
                {
                    level: 'error',
                    path: config.getLog.getErrorFolderPath(),
                    type: 'rotating-file',
                    period: '1d', // daily rotation 
                    count: 3
                }
            ]
        });
        console.log(config.messageList.infoList.msg_201.msg);

        return {
            log: logging
        }

    } catch (err) {
        var errorMsg = config.messageList.exceptionList.msg_1010;
        res.json({ "error_code": errorMsg.code, "error_msg": errorMsg.msg });
    }
}