'use strict';
var config = require("config");
module.exports = () => {
    console.log("config");
    return {
        getLog: {
            getErrorFolderPath: () => {
                const tsFormat = "2017-01-01";
                return config.get('logging.logFolderName') + tsFormat + "-" + config.get('logging.errorLogFileName') + ".log";
            },
            getInfoFolderPath: () => {
                const tsFormat = "2017-01-01";
                return config.get('logging.logFolderName') + tsFormat + "-" + config.get('logging.infoLogFileName') + ".log";
            },
            logLevel: 'debug'
        },
        mongoDB: {
            connectString: config.get("mongoDB.connectString") // "mongodb://vaskar:12345678@ds161001.mlab.com:61001/mytest_mongodb"
        },
        webserver: {
            protocol: "http",
            host: "localhost",
            port: 2000
        },
        cache: {
            expire: config.get('cache.expire')
        },
    }
}