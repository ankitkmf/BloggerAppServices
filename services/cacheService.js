'use strict';
//var promise = require("bluebird");
var redis = require('redis');
var redisClient = redis.createClient();

module.exports = (logger, config) => {
    try {

        var infoMsg = config.messageList.infoList;
        var errorMsg = config.messageList.exceptionList;

        var getCache = (key) => {
            return new Promise(function(resolve, reject) {
                console.log("in get cache promise for key:" + key);
                redisClient.get(key, (err, results) => {
                    if (!err) {
                        console.log("get cache key result:" + key);
                        resolve(results);
                    } else {
                        var _errorMsg = "error_code :" + errorMsg.msg_104.code + " , error_msg:" + errorMsg.msg_104.msg + " ,error:" + err;
                        console.log(_errorMsg);
                        reject(_errorMsg);
                    }
                });
            });
        };

        var setCache = (key, val) => {
            var _infoMsg = "info_code :" + infoMsg.msg_2013.code + " , info_msg:" + infoMsg.msg_2013.msg;
            console.log(_infoMsg);
            console.log("Set cache key result:" + key);
            redisClient.set(key, val);
        };

        var clearCache = () => {
            var _infoMsg = "info_code :" + infoMsg.msg_2012.code + " , info_msg:" + infoMsg.msg_2012.msg;
            console.log(_infoMsg);
            redisClient.flushall();
        };

        var setExpire = (key, time) => {
            var _infoMsg = "info_code :" + infoMsg.msg_2014.code + " , info_msg:" + infoMsg.msg_2014.msg;
            console.log(_infoMsg);
            console.log("Set cache set:" + key + " ,Expire:" + time);
            redisClient.expire(key, time);
        };

        var clearCacheKeys = (collection) => {
            console.log("clearCacheKeys collection " + collection);

            var filterText = '*_' + collection + '_*';
            redisClient.keys(filterText, function(err, keys) {
                if (err) return console.log(err);

                for (var i = 0, len = keys.length; i < len; i++) {
                    var cachekey = keys[i];
                    console.log(i + ": Cache key " + cachekey + " is  deleted");
                    redisClient.del(keys[i], function(err, o) {
                        //console.log("Cache key " + cachekey + " is  deleted");
                    });
                }
            });
        };

        console.log(infoMsg.msg_203.msg);
        // } catch (err) {
        //     var errorMsg = errorMsg.msg_1012;
        //     res.json({ "error_code": errorMsg.code, "error_msg": errorMsg.msg });
        // }

        return {
            get: (key) => {
                return getCache(key);
            },
            set: (key, val) => {
                return setCache(key, val);
            },
            clear: () => {
                return clearCache();
            },
            clearkey: (collection) => {
                console.log("clearkey");
                return clearCacheKeys(collection);
            },
            expire: (key, time) => {
                return setExpire(key, time);
            }
        }
    } catch (err) {
        var errorMsg = errorMsg.msg_1012;
        res.json({ "error_code": errorMsg.code, "error_msg": errorMsg.msg });
    }
}