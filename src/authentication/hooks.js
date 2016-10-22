"use strict";

const 
        dbAuth = require("./db-auth")
    ,   TokenModel = require('../models/token-model')
    ,   TokenCache = require('./token-cache');        


exports.validateClient = function (credentials, req, cb) {
    // Call back with `true` to signal that the client is valid, and `false` otherwise.
    // Call back with an error if you encounter an internal server error situation while trying to validate.

    var isValid = dbAuth.validateClient(credentials.clientId, credentials.clientSecret);

    cb(null, isValid);
};

exports.grantUserToken = function (credentials, req, cb) {
    
    dbAuth.validateUserCredentials(credentials.username, credentials.password)

    .then((result) => {

        if (result === true) {

            let mobileData = {};
            if (req.body.deviceId) {
                mobileData = {
                    deviceId: req.body.deviceId,
                    deviceName: req.body.deviceName,
                    firebaseToken: req.body.firebaseToken
                };
            }

            dbAuth.generateAndStoreToken(credentials.username, mobileData)
            .then((token) => {

               return cb(null, token);

            });
            
        }

    })

    .catch((err) => {
        return cb(null, false);
    });
};

exports.authenticateToken = function (token, req, cb) {

    TokenCache.getEmailForToken(token)
    .then((emailFromCache) => {

        req.username = emailFromCache;
        return cb(null, true);

    })
    .catch((err) => {

        TokenModel.findEmailFromToken(token)
        .then((emailFromDB) => {

            if (emailFromDB !== false) {
                req.username = emailFromDB;
                return cb(null, true);
            }

            else {
                return cb(null, false);
            }

        })
        .catch((err) => {
            return cb(null, false);
        });

    });

};