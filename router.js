"use strict";
var express = require("express");
var ObjectId = require("mongodb").ObjectID;
var bodyparser = require("body-parser");
const app = express();
var router = express.Router();

module.exports = (dir, services) => {
    router.get("/findone/:collection/:id", function(req, res) {
        try {
            // http://localhost:3000/findone/users/5945424df36d28265550c8ea
            // http://localhost:3000/findone/users/595cde84f8ce4a2250f38820
            res.header("Access-Control-Allow-Origin", "*");
            var key = "findone_" + req.params.collection + "_id_" + req.params.id;
            console.log("get key:" + key);

            var whereFilter = { _id: ObjectId(req.params.id) };
            var dataFilter = { usernamehash: false, password: false };
            var collection = req.params.collection;

            services.data
                .findOne(collection, whereFilter, dataFilter, key)
                .then(function(result) {
                    res.json(result);
                })
                .catch(function(error) {
                    res.json("data for key error: " + JSON.stringify(error));
                });
        } catch (err) {
            var error = { status: "failed", error: err.message };
            res.json(error);
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
                    res.json("data for key error: " + JSON.stringify(error));
                });
        } catch (err) {
            var error = { status: "failed", error: err.message };
            res.json(error);
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
            console.log("get key:" + key);

            // var whereFilter = { "_id": ObjectId(req.params.id) };
            var dataFilter = { usernamehash: false, password: false, _id: false };
            var collection = req.params.collection;
            // var key = "text";
            console.log("dataFilter:" + JSON.stringify(dataFilter));
            console.log("whereFilter:" + JSON.stringify(whereFilter));
            services.data
                .findAll(collection, whereFilter, dataFilter, key)
                .then(function(result) {
                    res.json(result);
                })
                .catch(function(error) {
                    res.json("data for key error: " + JSON.stringify(error));
                });
        } catch (err) {
            var error = { status: "failed", error: err.message };
            res.json(error);
        }
    });

    router.get("/clear", function(req, res) {
        //http:localhost:3000/clear
        services.cache.clear();
        res.send("clear all cache");
    });

    router.post("/saveSignUp", (req, res) => {
        try {
            console.log("post sign-up data " + JSON.stringify(req.body));
            var dataCollection = {
                // "usernamehash": bcrypt.hashSync(username, 10),
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
                    console.log("signup done successfully");
                    res.json(result);
                })
                .catch(function(error) {
                    console.log("sign-up 1:" + error);
                    res.json("Error in signup1: " + JSON.stringify(error));
                });
            // res.json(req.body);
        } catch (err) {
            console.log("sign-up 2:" + err);
            var error = { status: "Error in signup2", error: err.message };
            res.json(error);
        }
    });

    router.get("/getblogs/:si/:ct", (req, res) => {
        try {
            console.log("get blog data " + JSON.stringify(req.params));

            res.header("Access-Control-Allow-Origin", "*");
            var key = "getblogs_" + req.params.si + "_" + req.params.ct;
            console.log("get key:" + key);

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
                    res.json(result);
                })
                .catch(function(error) {
                    res.json("data for key error: " + JSON.stringify(error));
                });

        } catch (err) {
            console.log("Get Blogs 2 : " + err);
            var error = { status: "Error in retrieveing blogs", error: err.message };
            res.json(error);
        }
    });

    return router;
};