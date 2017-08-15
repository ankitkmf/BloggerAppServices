"use strict";
var express = require("express");
var ObjectId = require("mongodb").ObjectID;
var bodyparser = require("body-parser");
const app = express();
var router = express.Router();

module.exports = (dir, services) => {
    var infoMsg = services.config.messageList.infoList;
    var errorMsg = services.config.messageList.exceptionList;

    router.get("/findone/:collection/:id", function(req, res) {
        try {
            // http://localhost:3000/findone/users/5945424df36d28265550c8ea
            // http://localhost:3000/findone/users/595cde84f8ce4a2250f38820
            res.header("Access-Control-Allow-Origin", "*");
            var key = "findone_" + req.params.collection + "_id_" + req.params.id;
            var whereFilter = { _id: ObjectId(req.params.id) };
            var dataFilter = { usernamehash: false, password: false };
            var collection = req.params.collection;

            services.data
                .findOne(collection, whereFilter, dataFilter, key)
                .then(function(result) {
                    res.json(result);
                })
                .catch(function(error) {
                    var _errorMsg = "error_code :" + errorMsg.msg_106.code + " , error_msg:" + errorMsg.msg_106.msg + " ,error:" + error;
                    res.json(_errorMsg);
                });
        } catch (err) {
            var _errorMsg = "error_code :" + errorMsg.msg_102.code + " , error_msg:" + errorMsg.msg_102.msg + " ,error:" + err;
            res.json({ _errorMsg });
        }
    });

    router.get("/checkUserName/:username", function(req, res) {
        try {
            //http://localhost:3000/checkUserName/rohit
            //http://localhost:3000/checkUserName/ankit
            res.header("Access-Control-Allow-Origin", "*");
            var key = "checkUserName_users_username_" + req.params.username;
            console.log("get key:" + key);
            var whereFilter = { username: req.params.username };
            var collection = "users";
            services.data
                .checkUserName(collection, whereFilter, key)
                .then(function(result) {
                    res.json(result);
                })
                .catch(function(error) {
                    var _errorMsg = "error_code :" + errorMsg.msg_105.code + " , error_msg:" + errorMsg.msg_105.msg + " ,error:" + error;
                    res.json(_errorMsg);
                });
        } catch (err) {
            var _errorMsg = "error_code :" + errorMsg.msg_102.code + " , error_msg:" + errorMsg.msg_102.msg + " ,error:" + err;
            res.json({ _errorMsg });
        }
    });

    router.get("/findall/:collection/:type/:value?", function(req, res) {
        try {
            // http://localhost:3000/findall/users/all/
            //http://localhost:3000/findall/users/deactive/true
            //http://localhost:3000/findall/users/deactive/false
            //http://localhost:3000/findall/users/active/true
            //http://localhost:3000/findall/users/active/false
            //http://localhost:3000/findall/users/email/false
            //http://localhost:3000/findall/users/email/true
            res.header("Access-Control-Allow-Origin", "*");
            var whereFilter = {};
            var type = req.params.type != null ? req.params.type.toLowerCase() : null;
            var value =
                req.params.value != null && type != "all" ?
                req.params.value.toLowerCase() :
                "";

            console.log("type:" + type + " ,value:" + value);

            switch (type) {
                case "all":
                    // whereFilter = { "admin": true };
                    break;
                case "active":
                    whereFilter = { active: req.params.value === "true" };
                    break;
                case "deactive":
                    whereFilter = { active: req.params.value === "true" };
                    break;
                case "email":
                    whereFilter = { IsEmailVerified: req.params.value === "true" };
                    break;
                default:
                    break;
            }
            var key = "findall_" + req.params.collection + "_" + type + "_" + value;
            var dataFilter = { usernamehash: false, password: false, _id: false };
            var collection = req.params.collection;

            services.data
                .findAll(collection, whereFilter, dataFilter, key)
                .then(function(result) {
                    res.json(result);
                })
                .catch(function(error) {
                    var _errorMsg = "error_code :" + errorMsg.msg_107.code + " , error_msg:" + errorMsg.msg_107.msg + " ,error:" + error;
                    res.json(_errorMsg);
                });
        } catch (err) {
            var _errorMsg = "error_code :" + errorMsg.msg_102.code + " , error_msg:" + errorMsg.msg_102.msg + " ,error:" + err;
            res.json({ _errorMsg });
        }
    });

    router.get("/clear", function(req, res) {
        try {
            //http:localhost:3000/clear
            services.cache.clear();
            res.json("clear all cache");
        } catch (err) {
            var _errorMsg = "error_code :" + errorMsg.msg_102.code + " , error_msg:" + errorMsg.msg_102.msg + " ,error:" + err;
            res.json(_errorMsg);
        }
    });

    router.post("/saveSignUp", (req, res) => {
        try {
            var dataCollection = {
                "username": req.body.username,
                "name": req.body.name,
                "password": req.body.password, // bcrypt.hashSync(password, 10),
                "admin": false,
                "email": req.body.email,
                "IsEmailVerified": false,
                "active": false,
                "dateTime": new Date().toDateString()
            };

            var collection = "users";
            services.data.saveSignUP(collection, dataCollection)
                .then(function(result) {
                    res.json(result);
                })
                .catch(function(error) {
                    var _errorMsg = "error_code :" + errorMsg.msg_108.code + " , error_msg:" + errorMsg.msg_108.msg + " ,error:" + err;
                    res.json(_errorMsg);
                });
        } catch (err) {
            var _errorMsg = "error_code :" + errorMsg.msg_102.code + " , error_msg:" + errorMsg.msg_102.msg + " ,error:" + err;
            res.json(_errorMsg);
        }
    });

    router.get("/getblogs/:si/:ct", (req, res) => {
        try {
            //http://localhost:3000/getblogs/0/all
            //http://localhost:3000/getblogs/4/all
            //http://localhost:3000/getblogs/3/1
            //http://localhost:3000/getblogs/5/2
            //http://localhost:3000/getblogs/10/3
            //http://localhost:3000/getblogs/90/4
            res.header("Access-Control-Allow-Origin", "*");
            var key = "getblogs_" + req.params.si + "_" + req.params.ct;

            var whereFilter = {};
            var sortfilter = { "creationdate": 1 }; //--- 1 for asc and -1 for desc
            var si = req.params.si;
            var ct = req.params.ct;
            var collection = "blogs";

            if (ct == "all")
                whereFilter = { status: { $in: ["0", "1"] }, index: { $gt: si } };
            else
                whereFilter = { status: { $in: ["0", "1"] }, index: { $gt: si }, categorykey: ct };

            services.data
                .getblogs(collection, whereFilter, sortfilter, key)
                .then(function(result) {
                    res.send(result);
                })
                .catch(function(error) {
                    res.send("data for key error: " + JSON.stringify(error));
                });

        } catch (err) {
            var _errorMsg = "error_code :" + errorMsg.msg_102.code + " , error_msg:" + errorMsg.msg_102.msg + " ,error:" + err;
            res.send({ _errorMsg });
        }
    });

    router.post("/validateUserEmail", function(req, res) {
        try {
            //http://localhost:3000/validateUserEmail     
            console.log("Email:" + req.body.email);
            var whereFilter = { email: req.body.email };
            var dataFilter = { password: true, username: true };
            var collection = "users";
            // console.log("1:" + JSON.stringify(req.body));
            services.data
                .validateUserEmail(collection, whereFilter, dataFilter)
                .then(function(result) {
                    res.json(result);
                })
                .catch(function(error) {
                    var _errorMsg = "error_code :" + errorMsg.msg_1014.code + " , error_msg:" + errorMsg.msg_1014.msg + " ,error:" + error;
                    res.json(_errorMsg);
                });
        } catch (err) {
            var _errorMsg = "error_code :" + errorMsg.msg_102.code + " , error_msg:" + errorMsg.msg_102.msg + " ,error:" + err;
            res.json({ _errorMsg });
        }
    });

    return router;
};