"use strict";

const
		ContentModel = require('../models/content-model')
	,	TokenModel = require('../models/token-model')
	,	Firebase = require('firebase')
	, _ = require('lodash')
	, FileRepository = require('s3-repository');

module.exports.handleTextFile = (email, fileUrl, fileName, deviceId) => {

	return new Promise(function(resolve, reject) {

			let authKey;

			TokenModel.getForEmail(email)

			.then(data => {

				return new Promise(function(resolve, reject) {
					let tokenModel = getSingleTokenModel(data, deviceId);
					authKey = tokenModel.tokenHash;
					return resolve(tokenModel.mobileDevice.firebaseToken);
				});		

			})

			.then(firebaseToken => ContentModel.saveFile(email, deviceId, firebaseToken, fileUrl, fileName, "text"))

			.then((data) => {

				FileRepository.getTextFileContent(fileUrl, authKey)

				.then((text) => {
					if (data.firebaseToken) {
						Firebase.sendNotification(data.id, data.firebaseToken, "Text file '" + fileName + "'", text);	
					}
					
				});

				return resolve(data);
			})

			.catch(reject);

	});

}

function getSingleTokenModel(data, deviceId) {

		let index = _.findIndex(data.Items, (item) => item.mobileDevice && item.mobileDevice.deviceId == deviceId);
		let obj = _.nth(data.Items, index);
		return obj;

}