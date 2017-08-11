'use strict';
var mongoClient = require('mongodb').MongoClient;
var ObjectId = require("mongodb").ObjectID;

module.exports = (cache, logger, config) => {
    console.log('db');
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
                })
                //     .catch(function(err) {
                //     var error = { "status": "Failed , Connection error", "error": err };
                //     console.log(JSON.stringify(error));
                //     reject(error);
                // });
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
                })
                //     .catch(function(err) {
                //     var error = { "status": "Failed , Connection error", "error": err };
                //     console.log(JSON.stringify(error));
                // });
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
            })
            // .catch(function(err) {
            //     var error = { "status": "Failed , Connection error", "error": err };
            //     console.log(JSON.stringify(error));
            // });
    }

    let findblogs = function(collection, whereFilter, sortfilter) {
        return new Promise(function(resolve, reject) {
            connect().then(function(db) {
                console.log(JSON.stringify(whereFilter));
                console.log(JSON.stringify(sortfilter));
                db.collection(collection)
                    .find(whereFilter).limit(4).sort(sortfilter).toArray(function(err, results) {
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

    // let saveSignUP = (collection, dataCollection) => {
    //     return new Promise((resolve, reject) => {
    //         connect.then((db) => {
    //             db.collection(collection).save(dataCollection, (err, results) => {
    //                 if (!err)
    //                     resolve(results);
    //                 else
    //                     reject(err);
    //             });
    //         }).catch(function(err) {
    //             var error = { "status": "Failed , Connection error", "error": err };
    //             console.log(JSON.stringify(error));
    //         });
    //     });
    // };

    return {
        findOne: (collection, whereFilter, dataFilter, key) => {
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
                        resolve(JSON.parse(results));
                    } else {
                        checkUserName(collection, whereFilter).then(function(results) {
                            console.log("In checkUserName method");
                            // results = results >= 0 ? true : false;
                            console.log("results:" + results);
                            var data = { "result": (results > 0 ? true : false) };
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
        },

        saveSignUP: (collection, dataCollection) => {
            console.log("inside signup dataCollection:" + JSON.stringify(dataCollection));
            return new Promise((resolve, reject) => {
                connect().then((db) => {
                    db.collection(collection).save(dataCollection, (err, results) => {
                        console.log("inside signup 1");
                        if (!err) {
                            console.log("inside signup2");
                            resolve(results);
                        } else {
                            console.log("inside signup3");
                            reject(err);
                        }
                    });
                }).catch(function(err) {
                    var error = { "saveSignUP status": "Failed , Connection error", "error": err };
                    console.log(JSON.stringify(error));
                    reject(err);
                });
            });
        },


        getblogs: (collection, whereFilter, sortfilter, key) => {
            return new Promise(function(resolve, reject) {
                cache.get(key).then(results => {
                    if (results != null) {
                        console.log("result found in cache ");
                        resolve(results);
                    } else {
                        findblogs(collection, whereFilter, sortfilter).then(function(results) {
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
        }
    }
}