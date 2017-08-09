'use strict';

var express = require("express");
var router = express.Router();
var ObjectId = require("mongodb").ObjectID;

module.exports = router;

module.exports = (dir, services) => {

    router.get("/findone/:collection/:id", function(req, res) {
        // http://localhost:2000/findone/users/5945424df36d28265550c8ea
        // http://localhost:2000/findone/users/595cde84f8ce4a2250f38820

        try {
            res.header("Access-Control-Allow-Origin", "*");
            var key = "findone_" + req.params.collection + "_id_" + req.params.id
            console.log("get key:" + key);

            var whereFilter = { "_id": ObjectId(req.params.id) };
            var dataFilter = { "usernamehash": false, "password": false };
            var collection = req.params.collection;

            services.data.getDataByID(collection, whereFilter, dataFilter, key).then(function(result) {
                res.json(result);
            }).catch(function(error) {
                res.json("data for key error: " + JSON.stringify(error));
            });
        } catch (err) {
            var error = { "status": "failed", "error": err.message };
            res.json(error);
        }

    });

    router.get("/checkUserName/:username", function(req, res) {
        try {
            //http://localhost:3000/checkUserName/rohit
            //http://localhost:3000/checkUserName/ankit
            res.header("Access-Control-Allow-Origin", "*");
            // res.header("Access-Control-Allow-Headers", "X-Requested-With");
            var key = "checkUserName_users_username_" + req.params.username
            console.log("get key:" + key);
            var whereFilter = { "username": req.params.username };
            var collection = "users";
            services.data.checkUserName(collection, whereFilter, key).then(function(result) {
                res.json(result);
            }).catch(function(error) {
                res.json("data for key error: " + JSON.stringify(error));
            });
        } catch (err) {
            var error = { "status": "failed", "error": err.message };
            res.json(error);
        }

    });


    router.get("/findall/:collection/:type/:value?", function(req, res) {
        // http://localhost:2000/findall/users/all/
        //http://localhost:2000/findall/users/deactive/true
        //http://localhost:2000/findall/users/deactive/false
        //http://localhost:2000/findall/users/active/true
        //http://localhost:2000/findall/users/active/false
        //http://localhost:2000/findall/users/email/false
        //http://localhost:2000/findall/users/email/true

        try {
            res.header("Access-Control-Allow-Origin", "*");
            var whereFilter = {};
            var type = req.params.type != null ? req.params.type.toLowerCase() : null;
            var value = req.params.value != null && type != "all" ? req.params.value.toLowerCase() : "";


            console.log("type:" + type + " ,value:" + value);

            switch (type) {
                case "all":
                    // whereFilter = { "admin": true };
                    break;
                case "active":
                    whereFilter = { "active": (req.params.value === 'true') };
                    break;
                case "deactive":
                    whereFilter = { "active": (req.params.value === 'true') };
                    break;
                case "email":
                    whereFilter = { "IsEmailVerified": (req.params.value === 'true') };
                    break;
                default:
                    break;
            }
            var key = "findall_" + req.params.collection + "_" + type + "_" + value;
            console.log("get key:" + key);

            // var whereFilter = { "_id": ObjectId(req.params.id) };
            var dataFilter = { "usernamehash": false, "password": false, "_id": false };
            var collection = req.params.collection;
            // var key = "text";
            console.log("dataFilter:" + JSON.stringify(dataFilter));
            console.log("whereFilter:" + JSON.stringify(whereFilter));
            services.data.findAll(collection, whereFilter, dataFilter, key).then(function(result) {
                res.json(result);
            }).catch(function(error) {
                res.json("data for key error: " + JSON.stringify(error));
            });
        } catch (err) {
            var error = { "status": "failed", "error": err.message };
            res.json(error);
        }

    });

    router.get("/clear", function(req, res) {
        http: //localhost:2000/clear
            services.cache.clear();
        res.send("clear cache");
    });

    return router;
}