'use strict';
//var promise = require("bluebird");
var redis = require('redis');
var redisClient = redis.createClient();

module.exports = (logger, config) => {
    console.log("cache");
    return {
        get: (key) => {
            return new Promise(function(resolve, reject) {
                console.log("in get cache promise for key:" + key);
                redisClient.get(key, (err, results) => {
                    if (!err) {
                        console.log("get cache key result:");
                        resolve(results);
                    } else {
                        console.log("Error in get cache key ");
                        reject(err);
                    }
                });
            });
        },
        set: (key, val) => {
            return redisClient.set(key, val);
        },
        clear: () => {
            return redisClient.flushall();
        },
        expire: (key, time) => {
            return redisClient.expire(key, time);
        }
    }
}