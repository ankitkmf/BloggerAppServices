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
                    var data = { "result": "", "count": 0 };
                    db.collection(collection)
                        .findOne(whereFilter, dataFilter, (err, results) => {
                            console.log("step 1");
                            if (!err && results != null) {

                                data.result = results;
                                data.count = 1;
                                console.log("step 2");
                                resolve(data);
                            } else {
                                // console.log("step 3");
                                // var _errorMsg = "error_code :" + errorMsg.msg_106.code + " , error_msg:" + errorMsg.msg_106.msg + " ,error:" + err;
                                //results = {};
                                resolve(data);
                            }
                        })
                        // .catch(function(err) {
                        //     var _errorMsg = "error_code :" + errorMsg.msg_106.code + " , error_msg:" + errorMsg.msg_106.msg + " ,error:" + err;
                        //     console.log(_errorMsg);
                        //     reject({ _errorMsg });
                        // });
                })

            });
        }

        // let findTopRow = function(collection, whereFilter, dataFilter, sortFilter) {
        //     return new Promise(function(resolve, reject) {
        //         connect().then(function(db) {
        //             db.collection(collection)
        //                 .find(whereFilter, dataFilter).limit(1).sort(sortFilter).toArray(function(err, results) {
        //                     if (!err) {
        //                         logger.log.info("findTopRow method : data retrieve succesfully : results count : " + results.length);
        //                         resolve(results);
        //                     } else {
        //                         console.log(err);
        //                         logger.log.error("findTopRow method : error : " + err);
        //                         reject(err);
        //                     }
        //                 });
        //         }).catch(function(err) {
        //             console.log(44);
        //             logger.log.error("findTopRow method : connection error : " + err);
        //         });
        //     });
        // }

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

        let findAllWithSort = function(collection, whereFilter, dataFilter, sortfilter) {
            return new Promise(function(resolve, reject) {
                connect().then(function(db) {
                    db.collection(collection)
                        .find(whereFilter, dataFilter).sort(sortfilter).toArray(function(err, results) {
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

        let findblogs = function(collection, whereFilter, dataFilter, sortfilter, recordcount) {
            console.log("whereFilter " + JSON.stringify(whereFilter));
            console.log("sortfilter " + JSON.stringify(sortfilter));

            return new Promise(function(resolve, reject) {
                console.log("findblogs : findblog");
                connect().then(function(db) {
                    db.collection(collection)
                        .find(whereFilter, dataFilter).limit(4).sort(sortfilter).toArray(function(err, results) {
                            if (!err) {
                                console.log("aaa");
                                logger.log.info("findblogs method : data retrieve succesfully : results count : " + results.length);
                                resolve(results);
                            } else {
                                console.log(err);
                                logger.log.error("findblogs method : error : " + err);
                                reject(err);
                            }
                        });
                }).catch(function(err) {
                    console.log(44);
                    logger.log.error("findblogs method : connection error : " + err);
                });
            });
        }

        let findcomments = function(collection, whereFilter, sortfilter, recordcount) {
            console.log(recordcount);
            return new Promise(function(resolve, reject) {
                connect().then(function(db) {
                    db.collection(collection)
                        .find(whereFilter).limit(4).sort(sortfilter).toArray(function(err, results) {
                            if (!err) {
                                console.log(44 + " , " + results.length);

                                logger.log.info("findcomments method : data retrieve succesfully : results count : " + results.length);
                                resolve(results);
                            } else {
                                console.log(err);
                                logger.log.error("findcomments method : error : " + err);
                                reject(err);
                            }
                        });
                }).catch(function(err) {
                    console.log(44);
                    logger.log.error("findcomments method : connection error : " + err);
                });
            });
        }

        let finddatabyrange = function(collection, whereFilter, dataFilter, sortfilter, recordcount) {
            return new Promise(function(resolve, reject) {
                connect().then(function(db) {

                    db.collection(collection)
                        .find(whereFilter, dataFilter).limit(parseInt(recordcount)).sort(sortfilter).toArray(function(err, results) {
                            if (!err) {
                                console.log("aaa ");
                                logger.log.info("finddatabyrange method : data retrieve succesfully : results count : " + results.length);
                                resolve(results);
                            } else {
                                console.log(err);
                                logger.log.error("finddatabyrange method : error : " + err);
                                reject(err);
                            }
                        });

                }).catch(function(err) {
                    console.log(44);
                    logger.log.error("finddatabyrange method : connection error : " + err);
                });
            });
        }

        let insert = function(collection, dataCollection) {
            console.log("9");
            return new Promise(function(resolve, reject) {
                connect().then(function(db) {
                    console.log(JSON.stringify(dataCollection));
                    db.collection(collection)
                        .save(dataCollection, (err, result) => {
                            if (!err) {
                                console.log("10");
                                logger.log.info("insert method : results count : " + result.length);
                                resolve(result);
                            } else {
                                console.log("11");
                                logger.log.error("insert method : error : " + err);
                                reject(err);
                            }
                        });
                }).catch(function(err) {
                    logger.log.error("insert method : connection error : " + err);
                });
            });
        }

        let update = function(collection, dataCollection, wherefilter) {
            return new Promise(function(resolve, reject) {
                connect().then(function(db) {
                    db.collection(collection).update(wherefilter, {
                        $set: dataCollection
                    }, { upsert: false }, (err, results) => {
                        if (!err) {
                            console.log("content updated Successfully");
                            logger.log.info("update method : Updated content successfully");
                            resolve(results);
                        } else {
                            logger.log.info("update method : Error in updating content : error " + err);
                            reject(err);
                        }
                    });
                }).catch(function(err) {
                    logger.log.error("update method : connection error : " + err);
                });
            });
        }

        let updatemultirecord = function(collection, dataCollection, wherefilter) {
            return new Promise(function(resolve, reject) {
                connect().then(function(db) {
                    db.collection(collection).update(wherefilter, {
                        $set: dataCollection
                    }, { upsert: false, multi: true }, (err, results) => {
                        if (!err) {
                            console.log("content updated Successfully");
                            logger.log.info("update method : Updated content successfully");
                            resolve(results);
                        } else {
                            logger.log.info("update method : Error in updating content : error " + err);
                            reject(err);
                        }
                    });
                }).catch(function(err) {
                    logger.log.error("update method : connection error : " + err);
                });
            });
        }

        let addhistory = (collection, dataCollection) => {
            insert(collection, dataCollection).then(function(result) {
                logger.log.info("addhistory method : data added successfully : " +
                    "Collection Name : " + collection +
                    ", Data " + JSON.stringify(dataCollection));

                console.log("addhistory : inserted : Collection Name : " + collection +
                    ", Data " + JSON.stringify(dataCollection));
            }).catch(function(err) {
                console.log(err);
                logger.log.error("addhistory method : data does not saved : " +
                    "Collection Name : " + collection +
                    ", Data " + JSON.stringify(dataCollection));
            });
        }

        console.log(infoMsg.msg_204.msg);

        return {
            findOne: (collection, whereFilter, dataFilter, key) => {
                return new Promise(function(resolve, reject) {
                    cache.get(key).then(results => {
                        console.log("Cache key result:" + results);
                        if (results != null) {
                            resolve(results);
                        } else {
                            findOne(collection, whereFilter, dataFilter).then(function(results) {
                                console.log("In find one method");
                                var data = { "result": results };
                                cache.set(key, JSON.stringify(data));
                                cache.expire(key, redisKeyExpire);
                                console.log("data store in data:" + JSON.stringify(data));
                                resolve(JSON.stringify(data));
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

                                cache.clearkey(collection);

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

            saveLoginHistory: (collection, dataCollection) => {
                console.log("inside saveLoginHistory dataCollection:" + JSON.stringify(dataCollection));
                return new Promise((resolve, reject) => {
                    connect().then((db) => {
                        db.collection(collection).save(dataCollection, (err, results) => {
                            console.log("inside saveLoginHistory 1");
                            if (!err) {
                                cache.clearkey(collection);
                                resolve(results);
                            } else {
                                var _errorMsg = "error_code :" + errorMsg.msg_1019.code + " , error_msg:" + errorMsg.msg_1019.msg + " ,error:" + err;
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
                // console.log("inside validateUserEmail dataCollection:" + JSON.stringify(dataCollection));
                //  console.log("inside validateUserEmail whereFilter:" + JSON.stringify(whereFilter));
                return new Promise((resolve, reject) => {
                    // connect().then((db) => {
                    //db.collection(collection).find(whereFilter, dataCollection).toArray(function(err, results) {
                    findOne(collection, whereFilter, dataCollection).then(function(results) {
                        // console.log("inside validateUserEmail 1");
                        // if (!err) {
                        //     console.log("inside validateUserEmail 1:" + JSON.stringify(results));
                        //  var data = { "result": results, "count": results.length };
                        var data = { "result": results };
                        resolve(data);
                        // } else {
                        //     var _errorMsg = "error_code :" + errorMsg.msg_1015.code + " , error_msg:" + errorMsg.msg_1015.msg + " ,error:" + err;
                        //     console.log("inside validateUserEmail 2" + _errorMsg);
                        //     reject(_errorMsg);
                        // }
                        // });
                    }).catch(function(err) {
                        var _errorMsg = "error_code :" + errorMsg.msg_102.code + " , error_msg:" + errorMsg.msg_102.msg + " ,error:" + err;
                        console.log(_errorMsg);
                        reject(_errorMsg);
                    });
                });
            },

            getblogs: (collection, lbid, ct, dataFilter, sortfilter, key) => {
                return new Promise(function(resolve, reject) {
                    cache.get(key).then(results => {
                        if (results != null) {
                            logger.log.info("getblogs method : data retrieve from cache");
                            resolve(results);
                        } else {
                            var resultlimit = 4;

                            var whereFilter = {};
                            if (ct == "all" && lbid == "0")
                                whereFilter = { status: { $in: ["0", "1"] } };
                            else if (ct == "all" && lbid != "0")
                                whereFilter = { status: { $in: ["0", "1"] }, _id: { $lt: ObjectId(lbid) } };
                            else if (ct != "all" && lbid == "0")
                                whereFilter = { status: { $in: ["0", "1"] }, categorykey: ct };
                            else if (ct != "all" && lbid != "0")
                                whereFilter = { status: { $in: ["0", "1"] }, _id: { $lt: ObjectId(lbid) }, categorykey: ct };

                            console.log("getblogs " + JSON.stringify(whereFilter));

                            findblogs(collection, whereFilter, dataFilter, sortfilter, resultlimit).then(function(results) {
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

            getmostrecentblogs: (collection, whereFilter, dataFilter, sortfilter, key) => {
                return new Promise(function(resolve, reject) {
                    cache.get(key).then(results => {
                        if (results != null) {
                            logger.log.info("getblogs method : data retrieve from cache");
                            resolve(results);
                        } else {
                            var resultlimit = 4;

                            findblogs(collection, whereFilter, dataFilter, sortfilter, resultlimit).then(function(results) {
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

                        cache.clearkey(collection);

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
                                if (results != null) {
                                    data = { "result": results, "count": results.length };
                                }
                                cache.set(key, JSON.stringify(data));
                                cache.expire(key, redisKeyExpire);
                                logger.log.info("getaboutme method : data retrieved and stored in cache : Cache Key " + key);
                                resolve(data);
                            }).catch(function(err) {
                                var _errorMsg = "error_code :" + errorMsg.msg_1017.code + " , error_msg:" + errorMsg.msg_1017.msg + " ,error:" + err;
                                console.log(_errorMsg);
                                reject({ _errorMsg });
                            });
                        }
                    });
                });
            },

            getpersonaldetails: (collection, whereFilter, dataFilter, key) => {
                return new Promise(function(resolve, reject) {
                    cache.get(key).then(results => {
                        if (results != null) {
                            logger.log.info("getpersonaldetails method : data retrieve from cache");
                            resolve(results);
                        } else {
                            findOne(collection, whereFilter, dataFilter).then(function(results) {
                                var data = { "result": [], "count": 0 };
                                if (results != null) {
                                    data = { "result": results, "count": results.length };
                                }
                                cache.set(key, JSON.stringify(data));
                                cache.expire(key, redisKeyExpire);
                                logger.log.info("getpersonaldetails method : data retrieved and stored in cache : Cache Key " + key);
                                resolve(data);
                            }).catch(function(err) {
                                var _errorMsg = "error_code :" + errorMsg.msg_1017.code + " , error_msg:" + errorMsg.msg_1017.msg + " ,error:" + err;
                                console.log(_errorMsg);
                                reject({ _errorMsg });
                            });
                        }
                    });
                });
            },

            updatepassword: (collection, whereFilter, updateDataCollection) => {
                console.log("inside updatepassword dataCollection:" + JSON.stringify(updateDataCollection));
                return new Promise((resolve, reject) => {
                    connect().then((db) => {
                        db.collection(collection).update(whereFilter, { $set: updateDataCollection },
                            (err, results) => {
                                console.log("inside updatepassword 1");
                                if (!err) {
                                    resolve(results);
                                } else {
                                    var _errorMsg = "error_code :" + errorMsg.msg_1018.code + " , error_msg:" + errorMsg.msg_1018.msg + " ,error:" + err;
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

            UpdateUsersRecord: (collection, whereFilter, updateDataCollection) => {
                console.log("inside UpdateUsersRecord dataCollection 1:" + JSON.stringify(updateDataCollection));
                return new Promise((resolve, reject) => {
                    connect().then((db) => {
                        db.collection(collection).update(whereFilter, { $set: updateDataCollection },
                            (err, results) => {
                                console.log("inside UpdateUsersRecord 2");
                                if (!err) {
                                    console.log("success" + results);
                                    cache.clearkey(collection);
                                    resolve(results);
                                } else {
                                    var _errorMsg = "error_code :" + errorMsg.msg_1018.code + " , error_msg:" + errorMsg.msg_1018.msg + " ,error:" + err;
                                    console.log(_errorMsg);
                                    console.log("Error");
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

            updateaboutme: (collection, dataCollection, filter) => {

                var whereFilter = filter;
                var datafilter = {};

                return new Promise(function(resolve, reject) {

                    logger.log.info("updateaboutme method :  call findOne method : " +
                        "Collection Name : " + collection +
                        ", where filter : " + JSON.stringify(whereFilter));

                    findOne(collection, whereFilter, datafilter).then(function(results) {
                        if (results != undefined && results._id != undefined) {
                            whereFilter = { "_id": ObjectId(results._id) };
                            var updateQuery = { "content": dataCollection.content };

                            logger.log.info("updateaboutme method : call update method : " +
                                "Collection Name : " + collection +
                                ", updated query data : " + JSON.stringify(updateQuery) +
                                ", where filter : " + JSON.stringify(whereFilter));

                            update(collection, updateQuery, whereFilter).then(function(results) {
                                if (results != null && results != undefined) {

                                    logger.log.info("updateaboutme method : successfully updated about me details : " +
                                        "Collection Name : " + collection +
                                        ", updated query data : " + JSON.stringify(results));

                                    cache.clearkey(collection);

                                    resolve(results);
                                }
                            }).catch(function(err) {
                                logger.log.error("updateaboutme method : Erorr in updating about me details : " +
                                    "Collection Name : " + collection +
                                    ", Error : " + err);
                                reject(err);
                            });
                        } else {
                            insert(collection, dataCollection).then(function(result) {
                                logger.log.info("updateaboutme method : data added successfully : " +
                                    "Collection Name : " + collection +
                                    ", Data " + JSON.stringify(dataCollection));
                                resolve(result);
                            }).catch(function(err) {
                                logger.log.error("updateaboutme method : data does not saved : " +
                                    "Collection Name : " + collection +
                                    ", Data " + JSON.stringify(dataCollection));;
                                reject(err);
                            });
                        }
                    }).catch(function(err) {
                        logger.log.error("updateaboutme method : Erorr in findOne method : " +
                            "Collection Name : " + collection +
                            ", Error : " + err);
                        reject(err);
                    });
                });
            },

            updatepersonaldetails: (collection, dataCollection, filter) => {

                var whereFilter = filter;
                var datafilter = {};

                return new Promise(function(resolve, reject) {

                    logger.log.info("updatepersonaldetails method :  call findOne method : " +
                        "Collection Name : " + collection +
                        ", where filter : " + JSON.stringify(whereFilter));

                    findOne(collection, whereFilter, datafilter).then(function(results) {
                        if (results != undefined && results._id != undefined) {
                            whereFilter = { "_id": ObjectId(results._id) };

                            var updateQuery = {
                                "firstname": dataCollection.firstname,
                                "lastname": dataCollection.lastname,
                                "dob": dataCollection.dob,
                                "address1": dataCollection.address1,
                                "address2": dataCollection.address2,
                                "country": dataCollection.country,
                                "pinno": dataCollection.pinno,
                                "phone": dataCollection.phone
                            };

                            logger.log.info("updatepersonaldetails method : call update method : " +
                                "Collection Name : " + collection +
                                ", updated query data : " + JSON.stringify(updateQuery) +
                                ", where filter : " + JSON.stringify(whereFilter));

                            update(collection, updateQuery, whereFilter).then(function(results) {
                                if (results != null && results != undefined) {

                                    logger.log.info("updatepersonaldetails method : successfully updated personal details : " +
                                        "Collection Name : " + collection +
                                        ", updated query data : " + JSON.stringify(results));

                                    cache.clearkey(collection);

                                    resolve(results);
                                }
                            }).catch(function(err) {
                                logger.log.error("updatepersonaldetails method : Erorr in updating personal details : " +
                                    "Collection Name : " + collection +
                                    ", Error : " + err);
                                reject(err);
                            });
                        } else {
                            return new Promise(function(resolve, reject) {
                                insert(collection, dataCollection).then(function(result) {
                                    logger.log.info("updatepersonaldetails method : data added successfully : " +
                                        "Collection Name : " + collection +
                                        ", Data " + JSON.stringify(dataCollection));
                                    resolve(result);
                                }).catch(function(err) {
                                    logger.log.error("updatepersonaldetails method : data does not saved : " +
                                        "Collection Name : " + collection +
                                        ", Data " + JSON.stringify(dataCollection));;
                                    reject(err);
                                });
                            })
                        }
                    }).catch(function(err) {
                        logger.log.error("updatepersonaldetails method : Erorr in findOne method : " +
                            "Collection Name : " + collection +
                            ", Error : " + err);
                        reject(err);
                    });
                });
            },

            updateproffessionaldetails: (collection, dataCollection, filter) => {

                var whereFilter = filter;
                var datafilter = {};

                return new Promise(function(resolve, reject) {

                    logger.log.info("updateproffessionaldetails method :  call findOne method : " +
                        "Collection Name : " + collection +
                        ", where filter : " + JSON.stringify(whereFilter));

                    findOne(collection, whereFilter, datafilter).then(function(results) {
                        if (results != undefined && results._id != undefined) {
                            whereFilter = { "_id": ObjectId(results._id) };

                            var updateQuery = {
                                "proffession": dataCollection.proffession,
                                "experience": dataCollection.experience,
                                "deptname": dataCollection.deptname,
                                "companyname": dataCollection.companyname,
                                "compemailid": dataCollection.compemailid,
                                "compphone": dataCollection.compphone,
                                "qualification": dataCollection.qualification,
                                "educationyear": dataCollection.educationyear,
                                "location": dataCollection.location
                            };

                            logger.log.info("updateproffessionaldetails method : call update method : " +
                                "Collection Name : " + collection +
                                ", updated query data : " + JSON.stringify(updateQuery) +
                                ", where filter : " + JSON.stringify(whereFilter));

                            update(collection, updateQuery, whereFilter).then(function(results) {
                                if (results != null && results != undefined) {

                                    logger.log.info("updateproffessionaldetails method : successfully updated proffessional details : " +
                                        "Collection Name : " + collection +
                                        ", updated query data : " + JSON.stringify(results));

                                    cache.clearkey(collection);

                                    resolve(results);
                                }
                            }).catch(function(err) {
                                logger.log.error("updateproffessionaldetails method : Erorr in updating proffessional details : " +
                                    "Collection Name : " + collection +
                                    ", Error : " + err);
                                reject(err);
                            });
                        } else {
                            return new Promise(function(resolve, reject) {
                                insert(collection, dataCollection).then(function(result) {
                                    logger.log.info("updateproffessionaldetails method : data added successfully : " +
                                        "Collection Name : " + collection +
                                        ", Data " + JSON.stringify(dataCollection));
                                    resolve(result);
                                }).catch(function(err) {
                                    logger.log.error("updateproffessionaldetails method : data does not saved : " +
                                        "Collection Name : " + collection +
                                        ", Data " + JSON.stringify(dataCollection));;
                                    reject(err);
                                });
                            })
                        }
                    }).catch(function(err) {
                        logger.log.error("updateproffessionaldetails method : Erorr in findOne method : " +
                            "Collection Name : " + collection +
                            ", Error : " + err);
                        reject(err);
                    });
                });
            },

            getproffessionaldetails: (collection, whereFilter, dataFilter, key) => {
                return new Promise(function(resolve, reject) {
                    cache.get(key).then(results => {
                        if (results != null) {
                            logger.log.info("getproffessionaldetails method : data retrieve from cache");
                            resolve(results);
                        } else {
                            findOne(collection, whereFilter, dataFilter).then(function(results) {
                                var data = { "result": [], "count": 0 };
                                if (results != null) {
                                    data = { "result": results, "count": results.length };
                                }
                                cache.set(key, JSON.stringify(data));
                                cache.expire(key, redisKeyExpire);
                                logger.log.info("getproffessionaldetails method : data retrieved and stored in cache : Cache Key " + key);
                                resolve(data);
                            }).catch(function(err) {
                                var _errorMsg = "error_code :" + errorMsg.msg_1017.code + " , error_msg:" + errorMsg.msg_1017.msg + " ,error:" + err;
                                console.log(_errorMsg);
                                reject({ _errorMsg });
                            });
                        }
                    });
                });
            },

            getblogsbyuserid: (collection, userid, lastblogid, dataFilter, sortfilter, recordcount, key) => {
                return new Promise(function(resolve, reject) {
                    cache.get(key).then(results => {
                        if (results != null) {
                            logger.log.info("getblogsbyuserid method : data retrieve from cache");
                            resolve(results);
                        } else {

                            var whereFilter = {};
                            if (lastblogid == "0")
                                whereFilter = { status: { $in: ["0", "1"] }, userid: userid };
                            else
                                whereFilter = {
                                    status: { $in: ["0", "1"] },
                                    _id: { $lt: ObjectId(lastblogid) },
                                    userid: userid
                                };

                            findblogs(collection, whereFilter, dataFilter, sortfilter, recordcount).then(function(results) {
                                var data = { "result": results, "count": results.length };
                                cache.set(key, JSON.stringify(data));
                                cache.expire(key, redisKeyExpire);
                                logger.log.info("getblogsbyuserid method : data retrieve from cache : Cache Key " + key);
                                resolve(data);
                            }).catch(function(err) {
                                logger.log.error("getblogsbyuserid method : data retrieve error " + err);
                                reject(err);
                            });
                        }
                    });
                });
            },

            // findMaxBlogIndex: (collection, sortfilter) => {
            //     return new Promise(function(resolve, reject) {
            //         connect().then(function(db) {
            //             db.collection(collection)
            //                 .find({}).limit(1).sort(sortfilter).toArray(function(err, results) {
            //                     if (!err) {
            //                         //var data = { "result": [], "count": 0 };
            //                         //if (results != null) {
            //                         //    data = { "result": results, "count": 1 };
            //                         //}
            //                         console.log("findMaxBlogIndex : " + JSON.stringify(results));
            //                         resolve(results);
            //                     } else {
            //                         console.log("findMaxBlogIndex " + err);
            //                         reject(err);
            //                     }
            //                 });
            //         });
            //     });
            // },

            addblog: (collection, dataCollection, filter, historycollection) => {
                var whereFilter = filter;
                var datafilter = {};
                var data = dataCollection;

                return new Promise(function(resolve, reject) {
                    insert(collection, dataCollection).then(function(result) {
                        logger.log.info("addblog method : data added successfully : " +
                            "Collection Name : " + collection +
                            ", Data " + JSON.stringify(dataCollection));


                        historycollection.blogid = ((result.ops[0])._id).toString();

                        cache.clearkey(collection);

                        addhistory("bloghistory", historycollection);

                        resolve(result);

                    }).catch(function(err) {
                        logger.log.error("addblog method : data does not saved : " +
                            "Collection Name : " + collection +
                            ", Data " + JSON.stringify(dataCollection));

                        //console.log("addblog 8");
                        reject(err);
                    });
                })
            },

            addblogcomment: (collection, dataCollection) => {

                return new Promise(function(resolve, reject) {
                    insert(collection, dataCollection).then(function(result) {
                        logger.log.info("addblogcomment method : data added successfully : " +
                            "Collection Name : " + collection +
                            ", Data " + JSON.stringify(dataCollection));

                        cache.clearkey(collection);

                        resolve(result);

                    }).catch(function(err) {
                        logger.log.error("addblogcomment method : data does not saved : " +
                            "Collection Name : " + collection +
                            ", Data " + JSON.stringify(dataCollection));

                        reject(err);
                    });
                })
            },

            getblogbyblogid: (collection, _id, dataFilter, key) => {
                return new Promise(function(resolve, reject) {
                    cache.get(key).then(results => {
                        if (results != null) {
                            logger.log.info("getblogbyblogid method : data retrieve from cache");
                            resolve(results);
                        } else {
                            var whereFilter = { "_id": ObjectId(_id) };
                            findOne(collection, whereFilter, dataFilter).then(function(results) {
                                var data = { "result": [], "count": 0 };
                                if (results != null) {
                                    data = { "result": results, "count": 1 };
                                }
                                cache.set(key, JSON.stringify(data));
                                cache.expire(key, redisKeyExpire);
                                logger.log.info("getblogbyblogid method : data retrieved and stored in cache : Cache Key " + key);
                                resolve(data);
                            }).catch(function(err) {
                                var _errorMsg = "error_code :" + errorMsg.msg_1017.code + " , error_msg:" + errorMsg.msg_1017.msg + " ,error:" + err;
                                console.log(_errorMsg);
                                reject({ _errorMsg });
                            });
                        }
                    });
                });
            },

            getblogcommentbyblogid: (collection, blogid, lastcommentid, sortfilter, recordcount, key) => {
                console.log(recordcount);
                return new Promise(function(resolve, reject) {
                    cache.get(key).then(results => {
                        if (results != null) {
                            logger.log.info("getblogcommentbyblogid method : data retrieve from cache");
                            resolve(results);
                        } else {
                            //console.log("2");
                            var whereFilter = {};
                            if (lastcommentid == "0")
                                whereFilter = { status: { $in: ["0", "1"] }, "blogid": blogid };
                            else
                                whereFilter = {
                                    status: { $in: ["0", "1"] },
                                    _id: { $lt: ObjectId(lastcommentid) },
                                    "blogid": blogid
                                };

                            findcomments(collection, whereFilter, sortfilter, recordcount).then(function(results) {
                                var data = { "result": results, "count": results.length };
                                cache.set(key, JSON.stringify(data));
                                cache.expire(key, redisKeyExpire);
                                logger.log.info("getblogcommentbyblogid method : data retrieve from cache : Cache Key " + key);
                                resolve(data);
                            }).catch(function(err) {
                                logger.log.error("getblogcommentbyblogid method : data retrieve error " + err);
                                reject(err);
                            });
                        }
                    });
                });
            },

            deleteblogbyblogid: (collection, _id, filter, historycollection) => {

                console.log(JSON.stringify(filter));
                var whereFilter = { "_id": ObjectId(_id) };
                var datafilter = {};

                return new Promise(function(resolve, reject) {

                    logger.log.info("deleteblogbyblogid method :  call findOne method : " +
                        "Collection Name : " + collection +
                        ", where filter : " + JSON.stringify(whereFilter));

                    findOne(collection, whereFilter, datafilter).then(function(results) {
                        if (results != undefined && results._id != undefined) {
                            whereFilter = { "_id": ObjectId(results._id) };
                            var updateQuery = { "status": "2" };

                            historycollection.blogtopic = results.topic;

                            logger.log.info("deleteblogbyblogid method : call update method : " +
                                "Collection Name : " + collection +
                                ", updated query data : " + JSON.stringify(updateQuery) +
                                ", where filter : " + JSON.stringify(whereFilter));

                            update(collection, updateQuery, whereFilter).then(function(results) {
                                if (results != null && results != undefined) {

                                    console.log("3");

                                    logger.log.info("deleteblogbyblogid method : successfully disabled a blog : " +
                                        "Collection Name : " + collection +
                                        ", updated query data : " + JSON.stringify(results));

                                    cache.clearkey(collection);

                                    //Updated comment
                                    collection = "comments";
                                    whereFilter = { "blogid": _id };
                                    updateQuery = { "status": "2" };
                                    updatemultirecord(collection, updateQuery, whereFilter).then(function(results) {

                                        console.log("1");
                                        logger.log.info("updatecomment method : successfully disabled a blog : " +
                                            "Collection Name : " + collection +
                                            ", updated query data : " + JSON.stringify(results));

                                        resolve(results);
                                    }).catch(function(err) {
                                        console.log("2");
                                        logger.log.error("updatecomment method : Erorr in disabling the blog : " +
                                            "Collection Name : " + collection +
                                            ", Error : " + err);
                                        reject(err);
                                    });

                                    addhistory("bloghistory", historycollection);

                                    resolve(results);
                                }
                            }).catch(function(err) {

                                console.log("33333");
                                logger.log.error("deleteblogbyblogid method : Erorr in disabling the blog : " +
                                    "Collection Name : " + collection +
                                    ", Error : " + err);
                                reject(err);
                            });
                        }
                    }).catch(function(err) {
                        logger.log.error("deleteblogbyblogid method : Erorr in findOne method : " +
                            "Collection Name : " + collection +
                            ", Error : " + err);
                        reject(err);
                    });
                });
            },

            editblog: (collection, dataCollection, filter, historycollection) => {

                console.log("editblog " + 1 + " , " + JSON.stringify(dataCollection));

                var whereFilter = { "_id": ObjectId(dataCollection._id) };
                var datafilter = {};

                return new Promise(function(resolve, reject) {

                    console.log("editblog " + 2);

                    logger.log.info("editblog method :  call findOne method : " +
                        "Collection Name : " + collection +
                        ", where filter : " + JSON.stringify(whereFilter));

                    findOne(collection, whereFilter, datafilter).then(function(results) {
                        if (results != undefined && results._id != undefined) {

                            console.log("editblog " + 3);

                            whereFilter = { "_id": ObjectId(results._id) };
                            var updateQuery = {
                                "topic": dataCollection.topic,
                                "content": dataCollection.content,
                                "categorykey": dataCollection.categorykey
                            };

                            logger.log.info("editblog method : call update method : " +
                                "Collection Name : " + collection +
                                ", updated query data : " + JSON.stringify(updateQuery) +
                                ", where filter : " + JSON.stringify(whereFilter));

                            update(collection, updateQuery, whereFilter).then(function(results) {
                                if (results != null && results != undefined) {

                                    cache.clearkey(collection);

                                    addhistory("bloghistory", historycollection);

                                    logger.log.info("editblog method : successfully updated the blog : " +
                                        "Collection Name : " + collection +
                                        ", updated query data : " + JSON.stringify(results));

                                    resolve(results);
                                }
                            }).catch(function(err) {

                                console.log("editblog " + 5);

                                logger.log.error("editblog method : Erorr in updating the blog : " +
                                    "Collection Name : " + collection +
                                    ", Error : " + err);
                                reject(err);
                            });
                        }
                    }).catch(function(err) {
                        console.log("editblog " + 6);

                        logger.log.error("editblog method : Erorr in findOne method : " +
                            "Collection Name : " + collection +
                            ", Error : " + err);
                        reject(err);
                    });
                });
            },

            // getbloghistoryuserid: (collection, userid, lastbloghistoryid, dataFilter, sortfilter, recordcount, key) => {
            //     console.log(recordcount);
            //     return new Promise(function(resolve, reject) {
            //         cache.get(key).then(results => {
            //             if (results != null) {
            //                 logger.log.info("getbloghistoryuserid method : data retrieve from cache");
            //                 resolve(results);
            //             } else {
            //                 var whereFilter = {};
            //                 if (lastbloghistoryid == "0")
            //                     whereFilter = { "userid": userid };
            //                 else
            //                     whereFilter = {
            //                         _id: { $lt: ObjectId(lastbloghistoryid) },
            //                         "userid": userid
            //                     };

            //                 finddatabyrange(collection, whereFilter, dataFilter, sortfilter, recordcount).then(function(results) {
            //                     var data = { "result": results, "count": results.length };
            //                     cache.set(key, JSON.stringify(data));
            //                     cache.expire(key, redisKeyExpire);
            //                     logger.log.info("getbloghistoryuserid method : data retrieve from cache : Cache Key " + key);
            //                     resolve(data);
            //                 }).catch(function(err) {
            //                     logger.log.error("getbloghistoryuserid method : data retrieve error " + err);
            //                     reject(err);
            //                 });
            //             }
            //         });
            //     });
            // },

            getbloglistbyuserid: (collection, whereFilter, dataFilter, sortfilter, key) => {

                return new Promise(function(resolve, reject) {
                    cache.get(key).then(results => {
                        if (results != null) {
                            logger.log.info("getbloglistbyuserid method : data retrieve from cache");
                            resolve(results);
                        } else {
                            findAllWithSort(collection, whereFilter, dataFilter, sortfilter).then(function(results) {
                                var data = { "result": results, "count": results.length };
                                cache.set(key, JSON.stringify(data));
                                cache.expire(key, redisKeyExpire);
                                logger.log.info("getbloghistoryuserid method : data retrieve from cache : Cache Key " + key);
                                resolve(data);
                            }).catch(function(err) {
                                logger.log.error("getbloghistoryuserid method : data retrieve error " + err);
                                reject(err);
                            });
                        }
                    });
                });
            },

            getbloghistorybyblogid: (collection, userid, selectedBlogID, dataFilter, sortfilter, key) => {

                return new Promise(function(resolve, reject) {
                    cache.get(key).then(results => {
                        if (results != null) {
                            logger.log.info("getbloghistorybyblogid method : data retrieve from cache");
                            resolve(results);
                        } else {
                            //var orFilter = { $or: [{ blogid: ObjectId(selectedBlogID) }, { blogid: selectedBlogID }] }
                            var whereFilter = {};
                            whereFilter = {
                                "blogid": selectedBlogID,
                                "userid": userid
                            };

                            findAllWithSort(collection, whereFilter, dataFilter, sortfilter).then(function(results) {
                                var data = { "result": results, "count": results.length };
                                cache.set(key, JSON.stringify(data));
                                cache.expire(key, redisKeyExpire);
                                logger.log.info("getbloghistorybyblogid method : data retrieve from cache : Cache Key " + key);
                                resolve(data);
                            }).catch(function(err) {
                                logger.log.error("getbloghistorybyblogid method : data retrieve error " + err);
                                reject(err);
                            });
                        }
                    });
                });
            },

            getcommentbyblogid: (collection, whereFilter, dataFilter, sortfilter, key) => {
                return new Promise(function(resolve, reject) {
                    cache.get(key).then(results => {
                        if (results != null) {
                            logger.log.info("getcommentbyblogid method : data retrieve from cache");
                            resolve(results);
                        } else {
                            findAllWithSort(collection, whereFilter, dataFilter, sortfilter).then(function(results) {
                                var data = { "result": results, "count": results.length };
                                cache.set(key, JSON.stringify(data));
                                cache.expire(key, redisKeyExpire);
                                logger.log.info("getcommentbyblogid method : data retrieve from cache : Cache Key " + key);
                                resolve(data);
                            }).catch(function(err) {
                                logger.log.error("getcommentbyblogid method : data retrieve error " + err);
                                reject(err);
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