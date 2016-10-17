"use strict";

const 
		EncryptGenerator = require('../authentication/encrypt-generator')
	,	UserModel = require('../models/user-model')
	, TokenModel = require('../models/token-model')
	, TokenCache = require('../authentication/token-cache');


module.exports.registerUser = (email, password) => {

	return new Promise(function(resolve, reject) {

		let salt =  EncryptGenerator.generateSalt(16);
		let passwordHash = EncryptGenerator.generatePasswordHash(password, salt);

		let user = {
			email: email,
			security: {
				salt: salt,
				passwordHash: passwordHash
			}
		};

		UserModel.createUser(user)

		.then(resolve)

		.catch(reject);

	});

};

module.exports.logoutUser = (token) => {

	return new Promise(function(resolve, reject) {

		TokenCache.removeToken(token);

		TokenModel.removeToken(token)
		.then((data) => {
			console.log(data);
			return resolve(data);
		})
		.catch((err) => {
			return reject(err);
		});

	});

};