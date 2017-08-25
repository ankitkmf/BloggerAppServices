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
            var dataFilter = { usernamehash: false };
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

    router.post("/updatepassword", function(req, res) {
        try {
            //http://localhost:3000/validateUserEmail     
            console.log("updatepassword pwd:" + req.body.pwd);
            console.log("updatepassword id:" + req.body.id);
            var whereFilter = { _id: ObjectId(req.body.id) };
            var updateFilter = { "password": req.body.pwd };
            var collection = "users";
            console.log("whereFilter:" + JSON.stringify(whereFilter));
            console.log("updateFilter:" + JSON.stringify(updateFilter));
            services.data
                .updatepassword(collection, whereFilter, updateFilter)
                .then(function(result) {
                    res.json(result);
                })
                .catch(function(error) {
                    var _errorMsg = "error_code :" + errorMsg.msg_1016.code + " , error_msg:" + errorMsg.msg_1016.msg + " ,error:" + error;
                    res.json(_errorMsg);
                });
        } catch (err) {
            var _errorMsg = "error_code :" + errorMsg.msg_102.code + " , error_msg:" + errorMsg.msg_102.msg + " ,error:" + err;
            res.json({ _errorMsg });
        }
    });

    /**
     * @swagger
     * definition:
     *   subscribedata:
     *     properties:
     *       name:
     *         type: string
     *       emailID:
     *         type: string
     */

    /**
     * @swagger
     * /updatesubscribe:
     *   post:
     *     tags:
     *       - Update Subscribe
     *     description: Update Subscribe
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: subscribedata
     *         description: subscribedata object
     *         in: body
     *         required: true
     *         schema:
     *           $ref: '#/definitions/subscribedata'
     *     responses:
     *       200:
     *         description: Successfully Subscribed
     */
    router.post("/updatesubscribe", function(req, res) {
        try {
            //http://localhost:3000/updatesubscribe     

            console.log(req.body.name + "," + req.body.emailID);

            var dataCollection = {
                "name": req.body.name,
                "emailID": req.body.emailID,
                "dateTime": new Date().toDateString()
            };

            console.log(JSON.stringify(dataCollection));

            var collection = "subscribeUser";
            services.data.insertsubscribeinfo(collection, dataCollection)
                .then(function(result) {
                    res.json(result);
                })
                .catch(function(error) {
                    var _errorMsg = "error_code :" + errorMsg.msg_1016.code + " , error_msg:" + errorMsg.msg_1016.msg + " ,error:" + err;
                    res.json(_errorMsg);
                });
        } catch (err) {
            var _errorMsg = "error_code :" + errorMsg.msg_102.code + " , error_msg:" + errorMsg.msg_102.msg + " ,error:" + err;
            res.json({ _errorMsg });
        }
    });

    /**
     * @swagger
     * /getaboutme/{_id}:
     *   get:
     *     tags:
     *       - About User
     *     description: Returns about a user
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: _id
     *         in: path
     *         description: user id
     *         required: true
     *         type: string
     *     responses:
     *       200:
     *         description: Successfully retrieved      
     */
    router.get("/getaboutme/:_id", (req, res) => {
        try {
            //http://localhost:3000/getaboutme/{_id}
            res.header("Access-Control-Allow-Origin", "*");

            var userid = req.params._id;
            var key = "getaboutme" + userid;
            var whereFilter = { "userid": userid };
            var dataFilter = {};
            var collection = "aboutme";

            services.data
                .getaboutme(collection, whereFilter, dataFilter, key)
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


    /**
     * @swagger
     * definition:
     *   aboutmedata:
     *     properties:
     *       userid:
     *         type: string
     *       data:
     *         type: string
     *       id:
     *         type: string
     */

    /**
     * @swagger
     * /updateaboutme:
     *   post:
     *     tags:
     *       - Add or update about me section
     *     description: Edit About me
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: aboutmedata
     *         description: aboutmedata object
     *         in: body
     *         required: true
     *         schema:
     *           $ref: '#/definitions/aboutmedata'
     *     responses:
     *       200:
     *         description: Successfully updated About Me
     */
    router.post("/updateaboutme", function(req, res) {
        try {
            //http://localhost:3000/updateaboutme   

            var dataCollection = {};
            var whereFilter = {};

            dataCollection = {
                "userid": req.body.userid,
                "content": req.body.data
            };

            if (req.body.userid != "") {
                whereFilter = { "userid": req.body.userid };
            }

            var collection = "aboutme";
            services.data.updateaboutme(collection, dataCollection, whereFilter)
                .then(function(result) {
                    res.json(result);
                }).catch(function(err) {
                    var _errorMsg = "error_code :" + errorMsg.msg_1016.code + " , error_msg:" + errorMsg.msg_1016.msg + " ,error:" + err;
                    res.json(_errorMsg);
                });
        } catch (err) {
            var _errorMsg = "error_code :" + errorMsg.msg_102.code + " , error_msg:" + errorMsg.msg_102.msg + " ,error:" + err;
            res.json({ _errorMsg });
        }
    });

    /**
     * @swagger
     * definition:
     *   personaldetails:
     *     properties:
     *       userid:
     *         type: string
     *       firstname:
     *         type: string
     *       lastname:
     *         type: string
     *       dob:
     *         type: string
     *       phone:
     *         type: string
     *       _id:
     *         type: string     
     */

    /**
     * @swagger
     * /updatepersonaldetails:
     *   post:
     *     tags:
     *       - Add or update personal details
     *     description: Edit personal details 
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: personaldetails
     *         description: personaldetails object
     *         in: body
     *         required: true
     *         schema:
     *           $ref: '#/definitions/personaldetails'
     *     responses:
     *       200:
     *         description: Successfully updated personal details
     */
    router.post("/updatepersonaldetails", function(req, res) {
        try {
            //http://localhost:3000/updatepersonaldetails

            var dataCollection = {};
            var whereFilter = {};

            dataCollection = {
                "userid": req.body.userid,
                "firstname": req.body.firstname,
                "lastname": req.body.lastname,
                "dob": req.body.dob,
                "phone": req.body.phone
            };

            if (req.body.userid != "") {
                whereFilter = { "userid": req.body.userid };
            }

            var collection = "personalinfo";
            services.data.updatepersonaldetails(collection, dataCollection, whereFilter)
                .then(function(result) {
                    res.json(result);
                }).catch(function(err) {
                    var _errorMsg = "error_code :" + errorMsg.msg_1016.code + " , error_msg:" + errorMsg.msg_1016.msg + " ,error:" + err;
                    res.json(_errorMsg);
                });
        } catch (err) {
            var _errorMsg = "error_code :" + errorMsg.msg_102.code + " , error_msg:" + errorMsg.msg_102.msg + " ,error:" + err;
            res.json({ _errorMsg });
        }
    });

    return router;
};