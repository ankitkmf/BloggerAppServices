'use strict';
var mongoClient = require('mongodb').MongoClient;
var ObjectId = require("mongodb").ObjectID;

module.exports = (cache, logger, config) => {

    var state = { db: null }
    var redisKeyExpire = config.cache.expire;

    let connect = function() {
        var url = config.mongoDB.connectString;
        return new Promise(function(resolve, reject) {
            if (state.db) {
                console.log("db already connected");
                resolve(state.db);
            } else {
                mongoClient.connect(url, function(err, db) {
                    if (err) {
                        console.log("db error : " + err);
                        reject(err);
                    } else {
                        console.log("db connected");
                        state.db = db;
                        resolve(db);
                    }
                })
            }
        });
    }

    let checkUserName = function(collection, whereFilter) {
        return new Promise(function(resolve, reject) {
            connect().then(function(db) {
                db.collection(collection)
                    .find(whereFilter, {}).count((err, results) => {
                        if (!err) {
                            resolve(results);
                        } else {
                            reject(err);
                        }
                    });
            }).catch(function(err) {
                var error = { "status": "Failed , Connection error", "error": err };
                console.log(JSON.stringify(error));
                reject(error);
            });
        });
    }

    let findOne = function(collection, whereFilter, dataFilter) {
        return new Promise(function(resolve, reject) {
            connect().then(function(db) {
                db.collection(collection)
                    .findOne(whereFilter, dataFilter, (err, results) => {
                        if (!err) {
                            resolve(results);
                        } else {
                            reject(err);
                        }
                    });
            }).catch(function(err) {
                var error = { "status": "Failed , Connection error", "error": err };
                console.log(JSON.stringify(error));
            });
        });
    }


    let findAll = function(collection, whereFilter, dataFilter) {
        return new Promise(function(resolve, reject) {
            connect().then(function(db) {
                console.log(JSON.stringify(whereFilter));
                db.collection(collection)
                    .find(whereFilter, dataFilter).toArray(function(err, results) {
                        if (!err) {
                            // console.log("results:" + results);
                            resolve(results);
                        } else {
                            reject(err);
                        }
                    });
            });
        }).catch(function(err) {
            var error = { "status": "Failed , Connection error", "error": err };
            console.log(JSON.stringify(error));
        });
    }

    return {
        getDataByID: (collection, whereFilter, dataFilter, key) => {
            return new Promise(function(resolve, reject) {
                cache.get(key).then(results => {
                    if (results != null) {
                        console.log("result found in cache ");
                        resolve(results);
                    } else {
                        findOne(collection, whereFilter, dataFilter).then(function(results) {
                            console.log("In find one method");
                            var data = { "result": results, "count": results.length };
                            cache.set(key, JSON.stringify(data));
                            cache.expire(key, redisKeyExpire);
                            console.log("data store in key:" + key);
                            resolve(data);
                        }).catch(function(err) {
                            console.log("error in getOneRecord " + err);
                            var error = { "status": "failed", "error": err };
                            reject(error);
                        });
                    }
                });

            });
        },

        findAll: (collection, whereFilter, dataFilter, key) => {
            return new Promise(function(resolve, reject) {
                cache.get(key).then(results => {
                    if (results != null) {
                        console.log("result found in cache ");
                        resolve(results);
                    } else {
                        findAll(collection, whereFilter, dataFilter).then(function(results) {
                            console.log("In getAllData method");
                            var data = { "result": results, "count": results.length };
                            cache.set(key, JSON.stringify(data));
                            cache.expire(key, redisKeyExpire);
                            console.log("data store in key:" + key);
                            resolve(data);
                        }).catch(function(err) {
                            console.log("error in getAllData " + err);
                            var error = { "status": "failed", "error": err };
                            reject(error);
                        });
                    }
                });

            });
        },

        checkUserName: (collection, whereFilter, key) => {
            return new Promise(function(resolve, reject) {
                cache.get(key).then(results => {
                    if (results != null) {
                        console.log("result found in cache ");
                        resolve(results);
                    } else {
                        checkUserName(collection, whereFilter).then(function(results) {
                            console.log("In checkUserName method");
                            var data = { "result": results, "count": results.length };
                            cache.set(key, JSON.stringify(data));
                            cache.expire(key, redisKeyExpire);
                            console.log("data store in key:" + key);
                            resolve(data);
                        }).catch(function(err) {
                            console.log("error in checkUserName " + err);
                            var error = { "status": "failed", "error": err };
                            reject(error);
                        });
                    }
                });

            });
        }
    }
}