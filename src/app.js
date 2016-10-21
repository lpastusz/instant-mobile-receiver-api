"use strict";

var restify = require('restify')
	, restifyOAuth2 = require('restify-oauth2')
	, hooks = require('./authentication/hooks')
	, fs = require('fs')
	, config = require('config')
    , AWS = require('aws-sdk');

var server = restify.createServer({
	name: config.server.name,
  version: require("../package.json").version,
});

server.pre(restify.CORS({
  origins: ['https://localhost:3000'],
  credentials: false,
  headers: ['authorization']
}));

restify.CORS.ALLOW_HEADERS.push("authorization");
server.on( "MethodNotAllowed", function(req, res) {
  if(req.method.toUpperCase() === "OPTIONS" ) {
    // Send the CORS headers
    res.header("Access-Control-Allow-Headers", restify.CORS.ALLOW_HEADERS.join( ", " ));
    res.send(204);
  }
  else {
    res.send(new restify.MethodNotAllowedError());
  }
});

// Add headers
server.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'https://localhost:3000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});


AWS.config.update({
    accessKeyId: process.env.accessKeyId,
    secretAccessKey: process.env.secretAccessKey,
    region: config.AWS.region,
    endpoint: config.AWS.endpoint
});

var RESOURCES = Object.freeze({
    TOKEN: "/api/user/login",
});

server.use(restify.authorizationParser());
server.use(restify.bodyParser());
restifyOAuth2.ropc(server, { tokenEndpoint: RESOURCES.TOKEN, hooks: hooks });


server.listen(config.server.port, function() {
	console.log('Server ' + config.server.name + ' is listening on port ' + config.server.port);
});

// initialize routes
require('./routes')(server);