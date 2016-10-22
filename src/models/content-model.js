"use strict";

const
		dbClient = require('db').documentClient
	, contentTableName = require('db').getTableName('content');


module.exports.save = (email, firebaseToken, text) => {

	return new Promise(function(resolve, reject) {

		let id = generateUniqueId(email);

		dbClient.put({
			ConditionExpression: 'attribute_not_exists(id)',
			TableName: contentTableName,
			Item: {
				id: id,
				email: email, 
				firebaseToken: firebaseToken,
				text: text
			}
		}, (err, data) => {

			if (err) {
				console.log(err);
				return reject(err);
			}

			if (!data) {
				return reject('Content not created');
			}

			return resolve(data);

		});

	});

}


function generateUniqueId(email) {

	let id = Date.now() + '_' + email + '_' + Math.floor(Math.random() * 99999);
	return id;

}