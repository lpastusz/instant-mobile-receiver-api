"use strict";

const
		dbClient = require('db').documentClient
	, contentTableName = require('db').getTableName('content');


module.exports.saveFile = (email, deviceId, firebaseToken, fileUrl, fileName, type) => {

	return new Promise(function(resolve, reject) {

		let id = generateUniqueId(email);
		let item = {
			id: id,
			email: email,
			firebaseToken: firebaseToken,
			deviceId: deviceId,
			fileUrl: fileUrl,
			fileName: fileName,
			type: 'textfile'
		};

		dbClient.put({
			ConditionExpression: 'attribute_not_exists(id)',
			TableName: contentTableName,
			Item: item
		}, (err, data) => {

			if (err) {
				console.log(err);
				return reject(err);
			}

			if (!data) {
				return reject('Content not created');
			}

			return resolve(item);

		});

	});

}


module.exports.saveText = (email, deviceId, firebaseToken, text) => {

	return new Promise(function(resolve, reject) {

		let id = generateUniqueId(email);
		let item = {
			id: id,
			email: email,
			firebaseToken: firebaseToken,
			deviceId: deviceId,
			text: text,
			type: 'text'
		};

		dbClient.put({
			ConditionExpression: 'attribute_not_exists(id)',
			TableName: contentTableName,
			Item: item
		}, (err, data) => {

			if (err) {
				console.log(err);
				return reject(err);
			}

			if (!data) {
				return reject('Content not created');
			}

			return resolve(item);

		});

	});

}

module.exports.getByEmail = (email) => {

	return new Promise(function(resolve, reject) {

		dbClient.query({
			TableName: contentTableName,
			IndexName: "email-index",
    	KeyConditionExpression: "#email = :email",
	    ExpressionAttributeNames:{
	        "#email": "email"
	    },
	    ExpressionAttributeValues: {
	        ":email": email
	    }
		}, (err, data) => {

			if (err) {
				return reject(err);
			}

			if (!data || !data.Items) {
				return reject("No content found");
			}

			return resolve(data);

		});

	});

}


function generateUniqueId(email) {

	let id = Date.now() + '_' + email + '_' + Math.floor(Math.random() * 99999);
	return id;

}