'use strict';
var config = require("config");
module.exports = () => {
    //console.log("config");
    console.log(config.messageList.infolist.msg_202.msg);

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
            port: config.get("app.webserver.port")
        },
        cache: {
            expire: config.get('cache.expire')
        },
        messageList: {
            exceptionList: {
                msg_101: {
                    code: config.get("messageList.exceptionList.msg_101.code"),
                    msg: config.get('messageList.exceptionList.msg_101.msg')
                },
                msg_102: {
                    code: config.get('messageList.exceptionList.msg_102.code'),
                    msg: config.get('messageList.exceptionList.msg_102.msg')
                },
                msg_103: {
                    code: config.get('messageList.exceptionList.msg_103.code'),
                    msg: config.get('messageList.exceptionList.msg_103.msg')
                },
                msg_104: {
                    code: config.get('messageList.exceptionList.msg_104.code'),
                    msg: config.get('messageList.exceptionList.msg_104.msg')
                },
                msg_105: {
                    code: config.get('messageList.exceptionList.msg_105.code'),
                    msg: config.get('messageList.exceptionList.msg_105.msg')
                },
                msg_106: {
                    code: config.get('messageList.exceptionList.msg_106.code'),
                    msg: config.get('messageList.exceptionList.msg_101.msg')
                },
                msg_107: {
                    code: config.get('messageList.exceptionList.msg_107.code'),
                    msg: config.get('messageList.exceptionList.msg_107.msg')
                },
                msg_108: {
                    code: config.get('messageList.exceptionList.msg_108.code'),
                    msg: config.get('messageList.exceptionList.msg_108.msg')
                },
                msg_109: {
                    code: config.get('messageList.exceptionList.msg_109.code'),
                    msg: config.get('messageList.exceptionList.msg_109.msg')
                },
                msg_1010: {
                    code: config.get('messageList.exceptionList.msg_1010.code'),
                    msg: config.get('messageList.exceptionList.msg_1010.msg')
                },
                msg_1011: {
                    code: config.get('messageList.exceptionList.msg_1011.code'),
                    msg: config.get('messageList.exceptionList.msg_1011.msg')
                },
                msg_1012: {
                    code: config.get('messageList.exceptionList.msg_1012.code'),
                    msg: config.get('messageList.exceptionList.msg_1012.msg')
                },
                msg_1013: {
                    code: config.get('messageList.exceptionList.msg_1013.code'),
                    msg: config.get('messageList.exceptionList.msg_1013.msg')
                },
                msg_1014: {
                    code: config.get('messageList.exceptionList.msg_1014.code'),
                    msg: config.get('messageList.exceptionList.msg_1014.msg')
                },
                msg_1015: {
                    code: config.get('messageList.exceptionList.msg_1015.code'),
                    msg: config.get('messageList.exceptionList.msg_1015.msg')
                },
                msg_1016: {
                    code: config.get('messageList.exceptionList.msg_1016.code'),
                    msg: config.get('messageList.exceptionList.msg_1016.msg')
                },
                msg_1019: {
                    code: config.get('messageList.exceptionList.msg_1019.code'),
                    msg: config.get('messageList.exceptionList.msg_1019.msg')
                }
            },
            infoList: {
                msg_201: {
                    code: config.get('messageList.infolist.msg_201.code'),
                    msg: config.get('messageList.infolist.msg_201.msg')
                },
                msg_202: {
                    code: config.get('messageList.infolist.msg_202.code'),
                    msg: config.get('messageList.infolist.msg_202.msg')
                },
                msg_203: {
                    code: config.get('messageList.infolist.msg_203.code'),
                    msg: config.get('messageList.infolist.msg_203.msg')
                },
                msg_204: {
                    code: config.get('messageList.infolist.msg_204.code'),
                    msg: config.get('messageList.infolist.msg_204.msg')
                },
                msg_205: {
                    code: config.get('messageList.infolist.msg_205.code'),
                    msg: config.get('messageList.infolist.msg_205.msg')
                },
                msg_206: {
                    code: config.get('messageList.infolist.msg_206.code'),
                    msg: config.get('messageList.infolist.msg_206.msg')
                },
                msg_207: {
                    code: config.get('messageList.infolist.msg_207.code'),
                    msg: config.get('messageList.infolist.msg_207.msg')
                },
                msg_208: {
                    code: config.get('messageList.infolist.msg_208.code'),
                    msg: config.get('messageList.infolist.msg_208.msg')
                },
                msg_209: {
                    code: config.get('messageList.infolist.msg_209.code'),
                    msg: config.get('messageList.infolist.msg_209.msg')
                },
                msg_2010: {
                    code: config.get('messageList.infolist.msg_2010.code'),
                    msg: config.get('messageList.infolist.msg_2010.msg')
                },
                msg_2011: {
                    code: config.get('messageList.infolist.msg_2011.code'),
                    msg: config.get('messageList.infolist.msg_2011.msg')
                },
                msg_2012: {
                    code: config.get('messageList.infolist.msg_2012.code'),
                    msg: config.get('messageList.infolist.msg_2012.msg')
                },
                msg_2013: {
                    code: config.get('messageList.infolist.msg_2013.code'),
                    msg: config.get('messageList.infolist.msg_2013.msg')
                },
                msg_2014: {
                    code: config.get('messageList.infolist.msg_2014.code'),
                    msg: config.get('messageList.infolist.msg_2014.msg')
                },
                msg_2015: {
                    code: config.get('messageList.infolist.msg_2015.code'),
                    msg: config.get('messageList.infolist.msg_2015.msg')
                },
                msg_2016: {
                    code: config.get('messageList.infolist.msg_2016.code'),
                    msg: config.get('messageList.infolist.msg_2016.msg')
                },
                msg_2017: {
                    code: config.get('messageList.infolist.msg_2017.code'),
                    msg: config.get('messageList.infolist.msg_2017.msg')
                }
            }
        }
    }
}