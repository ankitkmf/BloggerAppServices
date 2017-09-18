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
                    res.send(result);
                })
                .catch(function(error) {
                    var _errorMsg = "error_code :" + errorMsg.msg_106.code + " , error_msg:" + errorMsg.msg_106.msg + " ,error:" + error;
                    res.send(_errorMsg);
                });
        } catch (err) {
            var _errorMsg = "error_code :" + errorMsg.msg_102.code + " , error_msg:" + errorMsg.msg_102.msg + " ,error:" + err;
            res.send({ _errorMsg });
        }
    });

    router.get("/checkUserName/:username", function(req, res) {
        try {
            //http://localhost:3000/checkUserName/rohit
            //http://localhost:3000/checkUserName/ankit
            res.header("Access-Control-Allow-Origin", "*");

            var whereFilter = { username: req.params.username };
            var collection = "users";

            var key = "checkUserName_" + collection + "_username_" + req.params.username;
            console.log("get key:" + key);

            services.data
                .checkUserName(collection, whereFilter, key)
                .then(function(result) {
                    res.send(result);
                })
                .catch(function(error) {
                    var _errorMsg = "error_code :" + errorMsg.msg_105.code + " , error_msg:" + errorMsg.msg_105.msg + " ,error:" + error;
                    res.send(_errorMsg);
                });
        } catch (err) {
            var _errorMsg = "error_code :" + errorMsg.msg_102.code + " , error_msg:" + errorMsg.msg_102.msg + " ,error:" + err;
            res.send({ _errorMsg });
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
            //http://localhost:3000/findall/userLoginHistory/userhistorybyid/5945424df36d28265550c8ea
            //http://localhost:3000/findall/userLoginHistory/alluserhistory
            //http://localhost:3000/findall/blogs/userblogbyid/595cde84f8ce4a2250f38820
            //http://localhost:3000/findall/blogs/totalblog/
            /// res.header("Access-Control-Allow-Origin", "*");
            var whereFilter = {};
            var type = req.params.type != null ? req.params.type.toLowerCase() : null;
            var dataFilter = { usernamehash: false, password: false };
            var value =
                req.params.value != null && type != "all" ?
                req.params.value.toLowerCase() :
                "";

            console.log("type:" + type + " ,value:" + value);
            // var dataFilter = { usernamehash: false, password: false };
            switch (type) {
                case "all":
                    // whereFilter = { "admin": true };
                    break;
                case "active":
                    whereFilter = { active: req.params.value === "true" };
                    break;
                case "admin":
                    whereFilter = { admin: req.params.value === "true" };
                    break;
                case "deactive":
                    whereFilter = { active: req.params.value === "true" };
                    break;
                case "email":
                    whereFilter = { IsEmailVerified: req.params.value === "true" };
                    break;
                case "google":
                    whereFilter = { authType: "google" };
                    break;
                case "facebook":
                    whereFilter = { authType: "facebook" };
                    break;
                case "local":
                    whereFilter = { authType: "local" };
                    break;
                case "alluserhistory":
                    whereFilter = {};
                    dataFilter = { _id: false, profileID: false, email: false, username: false };
                    break;
                case "userhistorybyid":
                    whereFilter = { "profileID": req.params.value };
                    dataFilter = { _id: false, profileID: false, email: false, username: false };
                    break;
                case "userblogbyid":
                    whereFilter = { "userid": req.params.value };
                    dataFilter = { userid: false, content: false, createdby: false };
                    break;
                case "usercommentsbyid":
                    whereFilter = { "userid": req.params.value };
                    dataFilter = { userid: false, comment: false, createdby: false, blogid: false };
                    break;
                case "userinfobyid":
                    whereFilter = { "_id": ObjectId(req.params.value) };
                    dataFilter = { password: false, username: false, email: false };
                    break;
                case "totalblog":
                    whereFilter = {};
                    dataFilter = { creationdate: false };
                    break;
                case "bapproved":
                    whereFilter = { status: "1" };
                    dataFilter = { creationdate: false };
                    break;
                case "bdisapproved":
                    whereFilter = { status: "2" };
                    dataFilter = { creationdate: false };
                    break;
                case "bpending":
                    whereFilter = { status: "0" };
                    dataFilter = { creationdate: false };
                    break;
                default:
                    break;
            }
            var key = "findall_" + req.params.collection + "_" + type + "_" + value;

            var collection = req.params.collection;
            console.log("whereFilter:" + JSON.stringify(whereFilter));
            console.log("dataFilter:" + JSON.stringify(dataFilter));

            services.data
                .findAll(collection, whereFilter, dataFilter, key)
                .then(function(result) {
                    res.send(result);
                })
                .catch(function(error) {
                    var _errorMsg = "error_code :" + errorMsg.msg_107.code + " , error_msg:" + errorMsg.msg_107.msg + " ,error:" + error;
                    res.send(_errorMsg);
                });
        } catch (err) {
            var _errorMsg = "error_code :" + errorMsg.msg_102.code + " , error_msg:" + errorMsg.msg_102.msg + " ,error:" + err;
            res.send({ _errorMsg });
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
                "active": true,
                "googlename": req.body.googlename,
                "facebookname": req.body.facebookname,
                "googleemail": req.body.googleemail,
                "facebookemail": req.body.facebookemail,
                "dateTime": new Date().toDateString(),
                "authType": req.body.authType,
                "profileID": req.body.profileID,
                "userImage": req.body.userImage
            };

            var collection = "users";
            services.data.saveSignUP(collection, dataCollection)
                .then(function(result) {
                    // console.log("result:" + result);
                    res.send(result);
                })
                .catch(function(error) {
                    var _errorMsg = "error_code :" + errorMsg.msg_108.code + " , error_msg:" + errorMsg.msg_108.msg + " ,error:" + err;
                    res.send(_errorMsg);
                });
        } catch (err) {
            var _errorMsg = "error_code :" + errorMsg.msg_102.code + " , error_msg:" + errorMsg.msg_102.msg + " ,error:" + err;
            res.json(_errorMsg);
        }
    });

    router.post("/saveLoginHistory", (req, res) => {
        try {

            var dataCollection = {
                "username": req.body.username,
                "name": req.body.name,
                "email": req.body.email,
                "authType": req.body.authType,
                "profileID": req.body.profileID,
                "dateTime": new Date().toDateString(),
            };

            var collection = "userLoginHistory";
            services.data.saveLoginHistory(collection, dataCollection)
                .then(function(result) {
                    res.json(result);
                })
                .catch(function(error) {
                    var _errorMsg = "error_code :" + errorMsg.msg_1019.code + " , error_msg:" + errorMsg.msg_1019.msg + " ,error:" + err;
                    res.json(_errorMsg);
                });
        } catch (err) {
            var _errorMsg = "error_code :" + errorMsg.msg_102.code + " , error_msg:" + errorMsg.msg_102.msg + " ,error:" + err;
            res.json(_errorMsg);
        }
    });

    router.post("/updateUsersRecord", (req, res) => {
        try {
            console.log("UpdateTableRecords Step 1");
            var filterQuery = { "_id": ObjectId(req.body.id) };
            console.log("UpdateTableRecords Step 2:" + JSON.stringify(filterQuery));
            var updateQuery = {
                "IsEmailVerified": (req.body.IsEmailVerified),
                "active": (req.body.active),
                "admin": (req.body.admin)
            };
            console.log("UpdateTableRecords step 2:" + JSON.stringify(updateQuery));
            var collection = "users";
            services.data.UpdateUsersRecord(collection, filterQuery, updateQuery)
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

    router.post("/updateBlogTableRecords", (req, res) => {
        try {
            console.log("updateBlogTableRecords Step 1");
            var filterQuery = { "_id": ObjectId(req.body.id) };
            console.log("updateBlogTableRecords Step 2:" + JSON.stringify(filterQuery));
            var updateQuery = { "status": req.body.type };
            console.log("UpdateTableRecords step 2:" + JSON.stringify(updateQuery));
            var collection = "blogs";
            services.data.UpdateUsersRecord(collection, filterQuery, updateQuery)
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

    router.get("/getblogs/:lbid/:ct", (req, res) => {
        try {
            //http://localhost:3000/getblogs/0/all
            //http://localhost:3000/getblogs/4/all
            //http://localhost:3000/getblogs/3/1
            //http://localhost:3000/getblogs/5/2
            //http://localhost:3000/getblogs/10/3
            //http://localhost:3000/getblogs/90/4
            res.header("Access-Control-Allow-Origin", "*");

            var sortfilter = { "creationdate": -1 }; //--- 1 for asc and -1 for desc
            var lbid = req.params.lbid;
            var ct = req.params.ct;
            var collection = "blogs";
            var dataFilter = {};

            var key = "getblogs_" + collection + "_" + req.params.lbid + "_" + req.params.ct;

            services.data
                .getblogs(collection, lbid, ct, dataFilter, sortfilter, key)
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

    router.get("/validateUserEmail/:email", function(req, res) {
        try {
            //http://localhost:3000/validateUserEmail     
            console.log("Email:" + req.params.email);
            var whereFilter = {
                $or: [{ email: req.params.email }, { googleemail: req.params.email }, { facebookemail: req.params.email }]
            };
            var dataFilter = { password: true, username: true, authType: true, userImage: true, IsEmailVerified: true, admin: true, email: true };
            var collection = "users";

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

    router.post("/validateUserOnReset", function(req, res) {
        try {
            //http://localhost:3000/validateUserOnReset     
            console.log("Email:" + req.body.email);
            var email = req.body.email;

            var whereFilter = {
                $or: [{ email: email }, { googleemail: email }, { facebookemail: email }]
            };
            var dataFilter = { password: true, username: true, authType: true, userImage: true, IsEmailVerified: true, admin: true, email: true };
            var collection = "users";

            services.data
                .validateUserEmail(collection, whereFilter, dataFilter)
                .then(function(result) {

                    console.log("4 " + JSON.stringify(result));

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
            console.log("updatepassword id:" + req.body.userid);
            var whereFilter = { _id: ObjectId(req.body.userid) };
            var updateFilter = { "password": req.body.pwd };
            var collection = "users";
            console.log("whereFilter:" + JSON.stringify(whereFilter));
            console.log("updateFilter:" + JSON.stringify(updateFilter));
            services.data
                .updatepassword(collection, whereFilter, updateFilter)
                .then(function(result) {
                    console.log("update");
                    res.json(result);
                })
                .catch(function(error) {
                    console.log("error");
                    var _errorMsg = "error_code :" + errorMsg.msg_1016.code + " , error_msg:" + errorMsg.msg_1016.msg + " ,error:" + error;
                    res.json(_errorMsg);
                });
        } catch (err) {
            console.log("error 1");
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
            //var key = "getaboutme_" + userid;
            var whereFilter = { "userid": userid };
            var dataFilter = {};
            var collection = "aboutme";

            var key = "getaboutme_" + collection + "_" + userid;

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
     *       _id:
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

            //if (req.body.userid != "") {
            whereFilter = { "userid": req.body.userid };
            //}

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
     *       address1:
     *         type: string
     *       address2:
     *         type: string
     *       country:
     *         type: string
     *       pinno:
     *         type: number
     *       phone:
     *         type: number
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
                "address1": req.body.address1,
                "address2": req.body.address2,
                "country": req.body.country,
                "pinno": req.body.pinno,
                "phone": req.body.phone
            };

            whereFilter = { "userid": req.body.userid };

            var collection = "personalinfoV2";
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


    /**
     * @swagger
     * /getpersonaldetails/{_id}:
     *   get:
     *     tags:
     *       - Personal info about User
     *     description: Returns user's personal info
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
    router.get("/getpersonaldetails/:_id", (req, res) => {
        try {
            //http://localhost:3000/getpersonaldetails/{_id}
            res.header("Access-Control-Allow-Origin", "*");

            var userid = req.params._id;
            //var key = "getpersonaldetails_" + userid;
            var whereFilter = { "userid": userid };
            var dataFilter = {};
            var collection = "personalinfoV2";

            var key = "getpersonaldetails_" + collection + "_" + userid;

            services.data
                .getpersonaldetails(collection, whereFilter, dataFilter, key)
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
     *   proffessionaldetail:
     *     properties:
     *       userid:
     *         type: string
     *       proffession:
     *         type: string
     *       experience:
     *         type: number
     *       deptname:
     *         type: string
     *       companyname:
     *         type: string
     *       compemailid:
     *         type: string
     *       compphone:
     *         type: number
     *       qualification:
     *         type: string
     *       educationyear:
     *         type: number
     *       location:
     *         type: string
     *       _id:
     *         type: string     
     */

    /**
     * @swagger
     * /updateproffessionaldetails:
     *   post:
     *     tags:
     *       - Add or update proffessional details
     *     description: Edit proffessional details 
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: personaldetails
     *         description: proffessional details object
     *         in: body
     *         required: true
     *         schema:
     *           $ref: '#/definitions/proffessionaldetail'
     *     responses:
     *       200:
     *         description: Successfully updated proffessional details
     */
    router.post("/updateproffessionaldetails", function(req, res) {
        try {
            //http://localhost:3000/updateproffessionaldetails

            var dataCollection = {};
            var whereFilter = {};

            dataCollection = {
                "userid": req.body.userid,
                "proffession": req.body.proffession,
                "experience": req.body.experience,
                "deptname": req.body.deptname,
                "companyname": req.body.companyname,
                "compemailid": req.body.compemailid,
                "compphone": req.body.compphone,
                "qualification": req.body.qualification,
                "educationyear": req.body.educationyear,
                "location": req.body.location
            };

            whereFilter = { "userid": req.body.userid };

            var collection = "proffessionalinfoV2";
            services.data.updateproffessionaldetails(collection, dataCollection, whereFilter)
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
     * /getproffessionaldetails/{_id}:
     *   get:
     *     tags:
     *       - proffessional info about User
     *     description: Returns user's proffessional info
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
    router.get("/getproffessionaldetails/:_id", (req, res) => {
        try {
            //http://localhost:3000/getproffessionaldetails/{_id}
            res.header("Access-Control-Allow-Origin", "*");

            var userid = req.params._id;
            //var key = "getproffessionaldetails_" + userid;
            var whereFilter = { "userid": userid };
            var dataFilter = {};
            var collection = "proffessionalinfoV2";

            var key = "getproffessionaldetails_" + collection + "_" + userid;

            services.data
                .getproffessionaldetails(collection, whereFilter, dataFilter, key)
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
     * /getblogsbyuserid/{userid}/{lastblogid}/{recordcount}:
     *   get:
     *     tags:
     *       - get blogs by userid
     *     description: Returns blogs by user id
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: userid
     *         in: path
     *         description: user id
     *         required: true
     *         type: string
     *       - name: lastblogid
     *         in: path
     *         description: last blog id
     *         required: true
     *         type: string 
     *       - name: recordcount
     *         in: path
     *         description: record count
     *         required: false
     *         type: number 
     *     responses:
     *       200:
     *         description: Successfully retrieved      
     */
    router.get("/getblogsbyuserid/:userid/:lastblogid/:recordcount?", (req, res) => {
        try {
            //http://localhost:3000/getblogsbyuserid/{userid}/{lastblogid}
            //http://localhost:3000/getblogsbyuserid/{userid}/{lastblogid}/6
            res.header("Access-Control-Allow-Origin", "*");

            var userid = req.params.userid;
            var lbid = req.params.lastblogid;
            var whereFilter = {};

            var rc = 4;

            var sortfilter = { "creationdate": -1 }; //--- 1 for asc and -1 for desc
            var dataFilter = {};
            var collection = "blogs";

            var key = "getblogsbyuserid_" + collection + "_" + userid + "_" + lbid + "_" + rc;

            console.log("vaskar: user id: " + userid + " , lbid : " + lbid + " , rc : " + rc + " , Key : " + key);


            services.data
                .getblogsbyuserid(collection, userid, lbid, dataFilter, sortfilter, rc, key)
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
     *   addblog:
     *     properties:
     *       topic:
     *         type: string
     *       content:
     *         type: string
     *       category:
     *         type: string
     *       userid:
     *         type: string
     *       createdby:
     *         type: string
     */

    /**
     * @swagger
     * /addblog:
     *   post:
     *     tags:
     *       - Add blog
     *     description: add blog 
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: addblog
     *         description: blog object
     *         in: body
     *         required: true
     *         schema:
     *           $ref: '#/definitions/addblog'
     *     responses:
     *       200:
     *         description: Successfully added the blog
     */
    router.post("/addblog", function(req, res) {
        try {
            //http://localhost:3000/addblog

            var dataCollection = {};
            var whereFilter = {};
            var sortfilter = { "creationdate": -1 }
            var collection = "blogs";

            dataCollection = {
                "userid": req.body.userid,
                "topic": req.body.topic,
                "content": req.body.content,
                "categorykey": req.body.category,
                "createdby": req.body.createdby,
                "status": "0",
                "creationdate": new Date().toISOString()
            };

            var historycollection = {
                "userid": req.body.userid,
                "date": new Date().toISOString(),
                "actiontype": "added",
                "blogtopic": req.body.topic
            }

            services.data.addblog(collection, dataCollection, whereFilter, historycollection)
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
     * /getblogbyblogid/{_id}:
     *   get:
     *     tags:
     *       - Blog by ID
     *     description: Returns a blog by blog ID
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: _id
     *         in: path
     *         description: blog id
     *         required: true
     *         type: string
     *     responses:
     *       200:
     *         description: Successfully retrieved      
     */
    router.get("/getblogbyblogid/:_id", (req, res) => {
        try {
            //http://localhost:3000/getblogbyblogid/{_id}
            res.header("Access-Control-Allow-Origin", "*");

            var _id = req.params._id;
            //var key = "getblogbyblogid_" + _id;
            var dataFilter = {};
            var collection = "blogs";

            var key = "getblogbyblogid_" + collection + "_" + _id;

            services.data
                .getblogbyblogid(collection, _id, dataFilter, key)
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
     * /getblogcommentbyblogid/{blogid}/{lastcommentid}/{recordcount}:
     *   get:
     *     tags:
     *       - get blog comments by blog id
     *     description: Returns blogs comments by blog id
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: blogid
     *         in: path
     *         description: blog id
     *         required: true
     *         type: string
     *       - name: lastcommentid
     *         in: path
     *         description: last comment id
     *         required: true
     *         type: string 
     *       - name: recordcount
     *         in: path
     *         description: record count
     *         required: false
     *         type: number 
     *     responses:
     *       200:
     *         description: Successfully retrieved      
     */
    router.get("/getblogcommentbyblogid/:blogid/:lastcommentid/:recordcount?", (req, res) => {
        try {
            //http://localhost:3000/getblogcommentbyblogid/{blogid}/{lastcommentid}
            //http://localhost:3000/getblogcommentbyblogid/{blogid}/{lastcommentid}/6
            res.header("Access-Control-Allow-Origin", "*");

            var blogid = req.params.blogid;
            var lcid = req.params.lastcommentid;

            var rc = 4;

            var sortfilter = { "creationdate": -1 }; // Sort --- 1 for asc and -1 for desc
            var dataFilter = {};
            var collection = "comments";

            //var key = "getblogcommentbyblogid_" + blogid + "_" + lcid + "_" + rc;

            var key = "getblogcommentbyblogid_" + collection + "_" + blogid + "_" + lcid + "_" + rc;

            services.data
                .getblogcommentbyblogid(collection, blogid, lcid, sortfilter, rc, key)
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
     * /deleteblogbyblogid/{_id}/{userid}:
     *   get:
     *     tags:
     *       - Delete Blog by ID
     *     description: delete a blog
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: _id
     *         in: path
     *         description: blog id
     *         required: true
     *         type: string
     *       - name: userid
     *         in: path
     *         description: user id
     *         required: true
     *         type: string
     *     responses:
     *       200:
     *         description: Successfully deleted      
     */
    router.get("/deleteblogbyblogid/:_id/:userid", (req, res) => {
        try {
            //http://localhost:3000/deleteblogbyblogid/{_id}/{userid}
            res.header("Access-Control-Allow-Origin", "*");

            var _id = req.params._id;
            var userid = req.params.userid;
            var dataFilter = {};
            var collection = "blogs";

            var historycollection = {
                "blogid": _id,
                "userid": userid,
                "date": new Date().toISOString(),
                "actiontype": "removed"
            }

            console.log(_id);

            services.data
                .deleteblogbyblogid(collection, _id, dataFilter, historycollection)
                .then(function(result) {
                    console.log("done");
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
     *   editblog:
     *     properties:
     *       topic:
     *         type: string
     *       content:
     *         type: string
     *       category:
     *         type: string
     *       _id:
     *         type: string
     *       userid:
     *         type: string   
     */

    /**
     * @swagger
     * /editblog:
     *   post:
     *     tags:
     *       - edit blog
     *     description: edit blog 
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: editblog
     *         description: blog object
     *         in: body
     *         required: true
     *         schema:
     *           $ref: '#/definitions/editblog'
     *     responses:
     *       200:
     *         description: Successfully updated the blog
     */
    router.post("/editblog", function(req, res) {
        try {
            //http://localhost:3000/editblog

            var dataCollection = {};
            var whereFilter = {};
            var collection = "blogs";

            dataCollection = {
                "_id": req.body._id,
                "topic": req.body.topic,
                "categorykey": req.body.categorykey,
                "content": req.body.content
            };

            //console.log("editblog dataCollection : " + JSON.stringify(dataCollection));

            var historycollection = {
                "blogid": req.body._id,
                "userid": req.body.userid,
                "date": new Date().toISOString(),
                "actiontype": "modified",
                "blogtopic": req.body.topic
            }

            services.data.editblog(collection, dataCollection, whereFilter, historycollection)
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
     *   addblogcomment:
     *     properties:
     *       blogid:
     *         type: string
     *       comment:
     *         type: string
     *       userid:
     *         type: string
     *       username:
     *         type: string
     *       blogtopic:
     *         type: string 
     */

    /**
     * @swagger
     * /addblogcomment:
     *   post:
     *     tags:
     *       - Add blog comment
     *     description: add blog comment
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: addblogcomment
     *         description: comment object
     *         in: body
     *         required: true
     *         schema:
     *           $ref: '#/definitions/addblogcomment'
     *     responses:
     *       200:
     *         description: Successfully added the blog comment
     */
    router.post("/addblogcomment", function(req, res) {
        try {
            //http://localhost:3000/addblogcomment

            var dataCollection = {};
            var whereFilter = { blogid: req.body.blogid };
            var sortfilter = { "creationdate": -1 }
            var collection = "comments";

            dataCollection = {
                "blogid": req.body.blogid,
                "comment": req.body.comment,
                "userid": req.body.userid,
                "username": req.body.username,
                "status": "0",
                "creationdate": new Date().toISOString()
            };

            services.data.addblogcomment(collection, dataCollection)
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
     * /getmostrecentblogs:
     *   get:
     *     tags:
     *       - List of most recent Blogs
     *     description: Returns list of most recent blogs
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: Successfully retrieved      
     */
    router.get("/getmostrecentblogs", (req, res) => {
        try {
            //http://localhost:3000/getmostrecentblogs
            res.header("Access-Control-Allow-Origin", "*");

            //var key = "getmostrecentblogs";
            var dataFilter = {
                userid: false,
                content: false,
                categorykey: false,
                createdby: false,
                status: false,
                creationdate: false
            };
            var whereFilter = { status: { $in: ["0", "1"] } };
            var sortfilter = { "creationdate": -1 }; //--- 1 for asc and -1 for desc
            var collection = "blogs";

            var key = "getmostrecentblogs_" + collection + "_most_recent";

            console.log(JSON.stringify(whereFilter));

            services.data
                .getmostrecentblogs(collection, whereFilter, dataFilter, sortfilter)
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

    // /**
    //  * @swagger
    //  * /getbloghistoryuserid/{userid}/{lastbloghistoryid}/{recordcount}:
    //  *   get:
    //  *     tags:
    //  *       - get blog history by user id
    //  *     description: Returns blogs history by user id
    //  *     produces:
    //  *       - application/json
    //  *     parameters:
    //  *       - name: userid
    //  *         in: path
    //  *         description: user id
    //  *         required: true
    //  *         type: string
    //  *       - name: lastbloghistoryid
    //  *         in: path
    //  *         description: last blog history id
    //  *         required: true
    //  *         type: string 
    //  *       - name: recordcount
    //  *         in: path
    //  *         description: record count
    //  *         required: false
    //  *         type: number 
    //  *     responses:
    //  *       200:
    //  *         description: Successfully retrieved      
    //  */
    // router.get("/getbloghistoryuserid/:userid/:lastbloghistoryid/:recordcount?", (req, res) => {
    //     try {
    //         //http://localhost:3000/getbloghistoryuserid/{userid}/{lastbloghistoryid}
    //         //http://localhost:3000/getbloghistoryuserid/{userid}/{lastbloghistoryid}/6
    //         res.header("Access-Control-Allow-Origin", "*");

    //         var userid = req.params.userid;
    //         var lbhid = req.params.lastbloghistoryid;
    //         var rc = 10;

    //         var sortfilter = { "date": -1 }; // Sort --- 1 for asc and -1 for desc
    //         var dataFilter = {};
    //         var collection = "bloghistory";

    //         var key = "getbloghistoryuserid_" + collection + "_" + userid + "_" + lbhid + "_" + rc;

    //         services.data
    //             .getbloghistoryuserid(collection, userid, lbhid, dataFilter, sortfilter, rc, key)
    //             .then(function(result) {
    //                 res.send(result);
    //             })
    //             .catch(function(error) {
    //                 res.send("data for key error: " + JSON.stringify(error));
    //             });

    //     } catch (err) {
    //         var _errorMsg = "error_code :" + errorMsg.msg_102.code + " , error_msg:" + errorMsg.msg_102.msg + " ,error:" + err;
    //         res.send({ _errorMsg });
    //     }
    // });

    /**
     * @swagger
     * /getbloglistbyuserid/{userid}:
     *   get:
     *     tags:
     *       - get blog list by user id
     *     description: Returns blogs list by user id
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: userid
     *         in: path
     *         description: user id
     *         required: true
     *         type: string
     *     responses:
     *       200:
     *         description: Successfully retrieved      
     */
    router.get("/getbloglistbyuserid/:userid", (req, res) => {
        try {
            //http://localhost:3000/getbloglistbyuserid/{userid}
            res.header("Access-Control-Allow-Origin", "*");

            var userid = req.params.userid;
            var sortfilter = { "creationdate": -1 }; // Sort --- 1 for asc and -1 for desc
            var dataFilter = { userid: false, content: false, categorykey: false, createdby: false, status: false, creationdate: false };
            var whereFilter = { "userid": userid };
            var collection = "blogs";

            var key = "getbloglistbyuserid_" + collection + "_" + userid;

            services.data
                .getbloglistbyuserid(collection, whereFilter, dataFilter, sortfilter, key)
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
     * /getbloghistorybyblogid/{userid}/{selectedBlogID}:
     *   get:
     *     tags:
     *       - get blog history by blog id
     *     description: Returns blogs history by blog id
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: userid
     *         in: path
     *         description: user id
     *         required: true
     *         type: string
     *       - name: selectedBlogID
     *         in: path
     *         description: selected blog id
     *         required: true
     *         type: string 
     *     responses:
     *       200:
     *         description: Successfully retrieved      
     */
    router.get("/getbloghistorybyblogid/:userid/:selectedBlogID", (req, res) => {
        try {
            //http://localhost:3000/getbloghistorybyblogid/{userid}/{selectedBlogID}
            res.header("Access-Control-Allow-Origin", "*");

            var userid = req.params.userid;
            var selectedBlogID = req.params.selectedBlogID;
            var sortfilter = { "date": 1 }; // Sort --- 1 for asc and -1 for desc
            var dataFilter = {};
            var collection = "bloghistory";

            var key = "getbloghistorybyblogid_" + collection + "_" + userid + "_" + selectedBlogID;

            services.data
                .getbloghistorybyblogid(collection, userid, selectedBlogID, dataFilter, sortfilter, key)
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
     * /getcommentbyblogid/{selectedBlogID}:
     *   get:
     *     tags:
     *       - get comment history by blog id
     *     description: Returns comment history by blog id
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: selectedBlogID
     *         in: path
     *         description: selected blog id
     *         required: true
     *         type: string 
     *     responses:
     *       200:
     *         description: Successfully retrieved      
     */
    router.get("/getcommentbyblogid/:selectedBlogID", (req, res) => {
        try {
            //http://localhost:3000/getcommentbyblogid/{selectedBlogID}
            res.header("Access-Control-Allow-Origin", "*");

            var selectedBlogID = req.params.selectedBlogID;
            var whereFilter = { "blogid": selectedBlogID };
            var sortfilter = { "creationdate": 1 }; // Sort --- 1 for asc and -1 for desc
            var dataFilter = {};
            var collection = "comments";

            var key = "getcommentbyblogid_" + collection + "_" + selectedBlogID;

            services.data
                .getcommentbyblogid(collection, whereFilter, dataFilter, sortfilter, key)
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

    router.post("/updatecomment", (req, res) => {
        try {
            console.log("updatecomment Step 1");
            var filterQuery = { "_id": ObjectId(req.body._id) };
            console.log("updatecomment Step 2:" + JSON.stringify(filterQuery));
            var updateQuery = { "status": req.body.status };
            console.log("updatecomment step 2:" + JSON.stringify(updateQuery));
            var collection = "comments";
            services.data.UpdateCommentStatus(collection, filterQuery, updateQuery)
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

    router.post("/updateprofilephotopath", (req, res) => {
        try {
            console.log("updateprofilephotopath Step 1");
            var filterQuery = { "_id": ObjectId(req.body.userid) };
            console.log("updateprofilephotopath Step 2:" + JSON.stringify(filterQuery));
            var updateQuery = { "localphoto": req.body.localphoto };
            console.log("updateprofilephotopath step 2:" + JSON.stringify(updateQuery));
            var collection = "users";
            services.data.updateprofilephotopath(collection, filterQuery, updateQuery)
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

    router.post("/updaterecords", (req, res) => {
        try {
            console.log("updaterecords Step 1,req.body.type:" + req.body.type);
            var whereQuery = {};
            var updateQuery = {};
            var collectoin = "";
            var type = req.body.type != null ? req.body.type.toLowerCase() : null;

            switch (type) {
                case "mapgoogleaccount":
                    collectoin = "users";
                    whereQuery = { "_id": ObjectId(req.body.id) };
                    updateQuery = {
                        "googleemail": req.body.googleemail,
                        "googlename": req.body.googlename,
                        "userImage": req.body.userImage,
                        // "authType": req.body.authType,
                        "mapGoogleUser": true
                    };
                    break;
                case "blogs":
                    collectoin = "blogs";
                    updateQuery = { "userid": req.body.mapuserid, "createdby": req.body.username };
                    whereQuery = { "userid": req.body.userid };
                    break;
                case "comments":
                    collectoin = "comments";
                    updateQuery = { "userid": req.body.mapuserid, "username": req.body.username };
                    whereQuery = { "userid": req.body.userid };
                    break;
                case "deactivegoogleuser":
                    collectoin = "users";
                    updateQuery = { "active": false };
                    whereQuery = { "googleemail": req.params.googleemail, "username": req.body.username };
                    break;
                case "blogshistory":
                    collectoin = "bloghistory";
                    updateQuery = { "userid": req.body.mapuserid };
                    whereQuery = { "userid": req.body.userid };
                    break;
                    // case "commentshistory":
                    //     collectoin = "users";
                    //     updateQuery = { "active": false };
                    //     whereQuery = { _id: ObjectId(req.params.id) };
                    //     break;
                case "loginhistory":
                    collectoin = "userLoginHistory";
                    updateQuery = { "profileID": req.body.mapuserid, "username": req.body.username };
                    whereQuery = { "profileID": req.body.userid };
                    break;
                default:
                    break;
            }

            //  console.log("updaterecords for " + collectoin + " ,updateQuery:" + JSON.stringify(updateQuery));
            //console.log("updaterecords for " + collectoin + " ,whereQuery:" + JSON.stringify(whereQuery));
            var collection = "users";
            services.data.updateRecords(collection, whereQuery, updateQuery)
                .then(function(result) {
                    res.send(result);
                })
                .catch(function(error) {
                    var _errorMsg = "error_code :" + errorMsg.msg_108.code + " , error_msg:" + errorMsg.msg_108.msg + " ,error:" + err;
                    res.send(_errorMsg);
                });
            // res.send(true);
        } catch (err) {
            var _errorMsg = "error_code :" + errorMsg.msg_102.code + " , error_msg:" + errorMsg.msg_102.msg + " ,error:" + err;
            res.json(_errorMsg);
        }
    });

    router.post("/verifyemailtrigger", function(req, res) {
        try {
            //http://localhost:3000/verifyemailtrigger     
            //console.log("updatepassword pwd:" + req.body.pwd);
            //console.log("updatepassword id:" + req.body.id);

            var userid = req.body.userid;
            var dt = req.body.dt;

            var dataCollection = {
                "userid": userid,
                "dt": dt
            }

            var whereFilter = { userid: userid };
            var updateQuery = { "dt": dt };
            var collection = "verifyemailtrigger";
            //console.log("whereFilter:" + JSON.stringify(whereFilter));
            //console.log("updateFilter:" + JSON.stringify(updateFilter));
            services.data
                .verifyemailtrigger(collection, whereFilter, updateQuery, dataCollection)
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

    router.get("/verifyemail/:userid", function(req, res) {
        try {
            //http://localhost:3000/verifyemail/{userid}     
            //console.log("updatepassword pwd:" + req.body.pwd);
            //console.log("updatepassword id:" + req.body.id);
            //res.header("Access-Control-Allow-Origin", "*");

            var userid = req.params.userid;
            var whereFilter = { userid: userid };
            var updateQuery = {};
            var collection = "verifyemailtrigger";

            services.data
                .verifyemail(collection, whereFilter, updateQuery)
                .then(function(result) {
                    console.log(JSON.stringify(result));
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

    router.post("/triggerfpwdemail", function(req, res) {
        try {
            //http://localhost:3000/triggerfpwdemail     
            //console.log("updatepassword pwd:" + req.body.pwd);
            //console.log("updatepassword id:" + req.body.id);

            var userid = req.body.userid;
            var dt = req.body.dt;

            var dataCollection = {
                "userid": userid,
                "dt": dt
            }

            var whereFilter = { userid: userid };
            var updateQuery = { "dt": dt };
            var collection = "fpwdemailtrigger";

            //console.log("whereFilter:" + JSON.stringify(whereFilter));
            //console.log("updateFilter:" + JSON.stringify(updateFilter));
            services.data
                .triggerfpwdemail(collection, whereFilter, updateQuery, dataCollection)
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

    router.get("/verifyfpwdemail/:userid", function(req, res) {
        try {
            //http://localhost:3000/verifyfpwdemail/{userid}     
            //console.log("updatepassword pwd:" + req.body.pwd);
            //console.log("updatepassword id:" + req.body.id);
            //res.header("Access-Control-Allow-Origin", "*");

            var userid = req.params.userid;
            var whereFilter = { userid: userid };
            var updateQuery = {};
            var collection = "verifyfpwdemail";

            services.data
                .verifyfpwdemail(collection, whereFilter, updateQuery)
                .then(function(result) {
                    console.log(JSON.stringify(result));
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

    return router;
};