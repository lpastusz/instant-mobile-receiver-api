"use strict";

const
		ContentModel = require('../models/content-model')
	,	TokenModel = require('../models/token-model')
	,	Firebase = require('firebase')
	, _ = require('lodash');

module.exports.uploadText = (email, text, deviceId) => {

	return new Promise(function(resolve, reject) {

			TokenModel.getForEmail(email)

			.then(data => getFirebaseTokenFromTokenModel(data, deviceId))

			.then(firebaseToken => ContentModel.saveText(email, deviceId, firebaseToken, text))

			.then((data) => {

				if (data.firebaseToken) {
					Firebase.sendNotification(data.id, data.firebaseToken, "Instant message", data.text);	
				}
				return resolve(data);
			})

			.catch(reject);

	});

}

function getFirebaseTokenFromTokenModel(data, deviceId) {

	return new Promise(function(resolve, reject) {

		let index = _.findIndex(data.Items, (item) => item.mobileDevice && item.mobileDevice.deviceId == deviceId);
		let obj = _.nth(data.Items, index);
		return resolve(obj.mobileDevice.firebaseToken);

	});

}