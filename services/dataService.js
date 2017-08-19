'use strict';
var mongoClient = require('mongodb').MongoClient;
var ObjectId = require("mongodb").ObjectID;

module.exports = (cache, logger, config) => {
    try {
        var state = { db: null }
        var redisKeyExpire = config.cache.expire;
        var infoMsg = config.messageList.infoList;
        var errorMsg = config.messageList.exceptionList;

        let connect = function() {
            var url = config.mongoDB.connectString;
            return new Promise(function(resolve, reject) {
                if (state.db) {
                    console.log(infoMsg.msg_206.msg);
                    resolve(state.db);
                } else {
                    mongoClient.connect(url, function(err, db) {
                        if (err) {
                            var _errorMsg = "error_code :" + errorMsg.msg_103.code + " , error_msg:" + errorMsg.msg_103.msg + " ,error:" + err;
                            console.log(_errorMsg);
                            reject(_errorMsg);
                        } else {
                            console.log(infoMsg.msg_205.msg);
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
                                var _errorMsg = "error_code :" + errorMsg.msg_109.code + " , error_msg:" + errorMsg.msg_109.msg + " ,error:" + err;
                                reject(_errorMsg);
                            }
                        });
                })
            });
        }

        let findOne = function(collection, whereFilter, dataFilter) {
            return new Promise(function(resolve, reject) {
                connect().then(function(db) {
                    db.collection(collection)
                        .findOne(whereFilter, dataFilter, (err, results) => {
                            if (!err) {
                                //console.log("0");
                                resolve(results);
                            } else {
                                //console.log("01");
                                var _errorMsg = "error_code :" + errorMsg.msg_106.code + " , error_msg:" + errorMsg.msg_106.msg + " ,error:" + err;
                                reject(_errorMsg);
                            }
                        });
                })

            });
        }

        let findAll = function(collection, whereFilter, dataFilter) {
            return new Promise(function(resolve, reject) {
                connect().then(function(db) {
                    console.log(JSON.stringify(whereFilter));
                    db.collection(collection)
                        .find(whereFilter, dataFilter).toArray(function(err, results) {
                            if (!err) {
                                resolve(results);
                            } else {
                                var _errorMsg = "error_code :" + errorMsg.msg_107.code + " , error_msg:" + errorMsg.msg_107.msg + " ,error:" + err;
                                reject(_errorMsg);
                            }
                        });
                });
            })
        }

        let findblogs = function(collection, whereFilter, sortfilter) {
            return new Promise(function(resolve, reject) {
                connect().then(function(db) {
                    db.collection(collection)
                        .find(whereFilter).limit(4).sort(sortfilter).toArray(function(err, results) {
                            if (!err) {
                                logger.log.info("findblogs method : data retrieve succesfully : results count : " + results.length);
                                resolve(results);
                            } else {
                                logger.log.error("findblogs method : error : " + err);
                                reject(err);
                            }
                        });
                }).catch(function(err) {
                    logger.log.error("findblogs method : connection error : " + err);
                });
            });
        }

        let insert = function(collection, dataCollection) {
            return new Promise(function(resolve, reject) {
                connect().then(function(db) {
                    console.log(JSON.stringify(dataCollection));
                    db.collection(collection)
                        .save(dataCollection, (err, result) => {
                            if (!err) {
                                logger.log.info("insert method : results count : " + result.length);
                                resolve(result);
                            } else {
                                logger.log.error("insert method : error : " + err);
                                reject(err);
                            }
                        });
                }).catch(function(err) {
                    logger.log.error("insert method : connection error : " + err);
                });
            });
        }

        console.log(infoMsg.msg_204.msg);

        return {
            findOne: (collection, whereFilter, dataFilter, key) => {
                return new Promise(function(resolve, reject) {
                    cache.get(key).then(results => {
                        if (results != null) {
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
                                var _errorMsg = "error_code :" + errorMsg.msg_102.code + " , error_msg:" + errorMsg.msg_102.msg + " ,error:" + err;
                                console.log(_errorMsg);
                                reject({ _errorMsg });
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
                                var _errorMsg = "error_code :" + errorMsg.msg_102.code + " , error_msg:" + errorMsg.msg_102.msg + " ,error:" + err;
                                console.log(_errorMsg);
                                reject(_errorMsg);
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
                                console.log("results:" + results);
                                var data = { "result": (results > 0 ? true : false) };
                                cache.set(key, JSON.stringify(data));
                                cache.expire(key, redisKeyExpire);
                                console.log("data store in key:" + key);
                                resolve(data);
                            }).catch(function(err) {
                                var _errorMsg = "error_code :" + errorMsg.msg_102.code + " , error_msg:" + errorMsg.msg_102.msg + " ,error:" + err;
                                console.log(_errorMsg);
                                reject(_errorMsg);
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
                                resolve(results);
                            } else {
                                var _errorMsg = "error_code :" + errorMsg.msg_108.code + " , error_msg:" + errorMsg.msg_108.msg + " ,error:" + err;
                                console.log(_errorMsg);
                                reject(err);
                            }
                        });
                    }).catch(function(err) {
                        var _errorMsg = "error_code :" + errorMsg.msg_102.code + " , error_msg:" + errorMsg.msg_102.msg + " ,error:" + err;
                        console.log(_errorMsg);
                        reject(_errorMsg);
                    });
                });
            },

            validateUserEmail: (collection, whereFilter, dataCollection) => {
                console.log("inside validateUserEmail dataCollection:" + JSON.stringify(dataCollection));
                return new Promise((resolve, reject) => {
                    connect().then((db) => {
                        db.collection(collection).find(whereFilter, dataCollection).toArray(function(err, results) {
                            // console.log("inside validateUserEmail 1");
                            if (!err) {
                                console.log("inside validateUserEmail 1:" + JSON.stringify(results));
                                var data = { "result": results, "count": results.length };
                                resolve(data);
                            } else {
                                var _errorMsg = "error_code :" + errorMsg.msg_1015.code + " , error_msg:" + errorMsg.msg_1015.msg + " ,error:" + err;
                                console.log("inside validateUserEmail 2" + _errorMsg);
                                reject(_errorMsg);
                            }
                        });
                    }).catch(function(err) {
                        var _errorMsg = "error_code :" + errorMsg.msg_102.code + " , error_msg:" + errorMsg.msg_102.msg + " ,error:" + err;
                        console.log(_errorMsg);
                        reject(_errorMsg);
                    });
                });
            },

            getblogs: (collection, whereFilter, sortfilter, key) => {
                return new Promise(function(resolve, reject) {
                    cache.get(key).then(results => {
                        if (results != null) {
                            logger.log.info("getblogs method : data retrieve from cache");
                            resolve(results);
                        } else {
                            findblogs(collection, whereFilter, sortfilter).then(function(results) {
                                var data = { "result": results, "count": results.length };
                                cache.set(key, JSON.stringify(data));
                                cache.expire(key, redisKeyExpire);
                                logger.log.info("getblogs method : data retrieve from cache : Cache Key " + key);
                                resolve(data);
                            }).catch(function(err) {
                                logger.log.error("getblogs method : data retrieve error " + err);
                                reject(err);
                            });
                        }
                    });
                });
            },

            insertsubscribeinfo: (collection, dataCollection) => {
                return new Promise(function(resolve, reject) {
                    insert(collection, dataCollection).then(function(result) {
                        logger.log.info("insertsubscribeinfo method : data saved successfully : " +
                            "Collection Name : " + collection +
                            ", Data " + JSON.stringify(dataCollection));
                        resolve(result);
                    }).catch(function(err) {
                        logger.log.error("insertsubscribeinfo method : data does not saved : " +
                            "Collection Name : " + collection +
                            ", Data " + JSON.stringify(dataCollection));;
                        reject(err);
                    });
                });
            },

            getaboutme: (collection, whereFilter, dataFilter, key) => {
                return new Promise(function(resolve, reject) {
                    cache.get(key).then(results => {
                        if (results != null) {
                            logger.log.info("getaboutme method : data retrieve from cache");
                            resolve(results);
                        } else {
                            findOne(collection, whereFilter, dataFilter).then(function(results) {
                                var data = { "result": [], "count": 0 };
                                if (results != null)
                                    data = { "result": results, "count": results.length };

                                cache.set(key, JSON.stringify(data));
                                cache.expire(key, redisKeyExpire);
                                logger.log.info("getaboutme method : data retrieve from cache : Cache Key " + key);
                                resolve(data);
                            }).catch(function(err) {
                                var _errorMsg = "error_code :" + errorMsg.msg_1017.code + " , error_msg:" + errorMsg.msg_1017.msg + " ,error:" + err;
                                console.log(_errorMsg);
                                reject({ _errorMsg });
                            });
                        }
                    });
                });
            }
        }
    } catch (err) {
        var _errorMsg = errorMsg.msg_1013;
        res.json({ "error_code": _errorMsg.code, "error_msg": _errorMsg.msg });
    }

}