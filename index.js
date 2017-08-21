'use strict';
var promise = require('bluebird');
const express = require('express');
const services = require('./servicelayer')('./services');
const router = require('./router.js')('./routes/', services);
const app = express();
var bodyparser = require("body-parser");
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(router);

const log = services.logger.log;

// swagger definition
var swaggerDefinition = {
    info: {
        title: 'Blogger Meet API',
        version: '1.0.0',
        description: 'Validate RESTful API with Swagger',
    },
    host: services.config.webserver.host + ":" + services.config.webserver.port,
    basePath: '/',
};

// options for the swagger docs
var options = {
    // import swaggerDefinitions
    swaggerDefinition: swaggerDefinition,
    // path to the API docs
    apis: ['./router.js'],
};

// initialize swagger-jsdoc
var swaggerJSDoc = require('swagger-jsdoc');
var swaggerSpec = swaggerJSDoc(options);
// serve swagger
app.get('/swagger.json', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});

var swaggerUi = require('swagger-ui-express');
var showExplorer = true;
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, showExplorer));

// process.on('uncaughtException', function(err) {
//     // log.error("uncaughtException:" + err);
//     console.log("uncaughtException:" + err);
// });
const server = app.listen(services.config.webserver.port, () => {
    console.log("Services connected at " + services.config.webserver.port);

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