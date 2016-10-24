"use strict";

const 
		_ = require('underscore')
	,	dbClient = require('db').documentClient
	, userTableName = require('db').getTableName('user')
	,	config = require('config')
	, EncryptGenerator = require('./encrypt-generator')
	, UserModel = require('../models/user-model')
	, TokenModel = require('../models/token-model')
	, TokenCache = require('./token-cache');

var clients = {
    web_client: { 
    	secret: config.authentication.web_client_secret 
    },
    android_client: {
    	secret: config.authentication.android_client_secret
    }
};


module.exports.validateClient = function(clientId, clientSecret) {

	var isValid = _.has(clients, clientId) &&
          clients[clientId].secret === clientSecret;

  return isValid;
}

module.exports.validateUserCredentials = function(email, password) {


	return new Promise(function(resolve, reject) {

		UserModel.getUserByEmail(email)

		.then((data) => {
			let salt = data.security.salt;

			if (data.security.passwordHash === EncryptGenerator.generatePasswordHash(password, salt)) {
				return resolve(true);
			}
			else {
				return reject(false);
			}
		})

		.catch((err) => {
			return reject(err);
		});

	});


}

module.exports.generateAndStoreToken = function(username, mobileDeviceData) {

	return new Promise(function(resolve, reject) {

		let restApiSecret = config.authentication.rest_api_secret;

		function loopForUniqueToken() {
			return new Promise(function(resolve, reject) {
				let currentToken = EncryptGenerator.generateToken(restApiSecret, username)
				console.log(currentToken);
				TokenModel.existToken(currentToken)
				.then((result) => {
					if (result === true) {
						return resolve(currentToken);
					}
					else {
						return resolve(loopForUniqueToken());
					}
				})
			});
		}

		loopForUniqueToken().then((token) => {
			resolve(token);

			let tokenDataCache = {
				tokenHash: token,
				email: username,
			};

			let tokenDataModel = {};

			if (mobileDeviceData) {
				tokenDataModel = {
					tokenHash: token,
					email: username,
					mobileDevice: mobileDeviceData
				};
			}
			else {
				tokenDataModel = {
					tokenHash: token,
					email: username
				};
			}

			TokenModel.insertToken(tokenDataModel);

			TokenCache.storeToken(tokenDataCache);
		});

	});

}
