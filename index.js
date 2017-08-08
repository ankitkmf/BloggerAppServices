'use strict';
var promise = require("bluebird");
const express = require('express');
const services = require('./servicelayer')('./services');
const router = require('./router.js')("./routes/", services);
const app = express();
app.use(router);
const log = services.logger.log;

// process.on('uncaughtException', function(err) {
//     // log.error("uncaughtException:" + err);
//     console.log("uncaughtException:" + err);
// });
const server = app.listen(services.config.webserver.port, () => {
    console.log("text");

    console.log(services.config.webserver.port);

    // services.data.getOneRecord(collection, filter, key).then(function(result) {
    //     console.log("Index page result:" + JSON.stringify(result));
    // }).catch(function(error) {
    //     console.log("find one error:" + JSON.stringify(error));
    // });

    // console.log(services.config.getLog.logLevel);
    // console.log(services.config.getLog.getInfoFolderPath());
    // console.log(services.config.mongoDB.connectString);
    //log.info("*********************************");
    // services.log.error("* App listening on port " + server.address().port);
    //services.log.info("info*********************************");
});