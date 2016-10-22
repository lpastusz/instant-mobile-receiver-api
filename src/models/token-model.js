const
		dbClient = require('db').documentClient
	, tokenTableName = require('db').getTableName('token');


module.exports.getForEmail = (email) => {

	return new Promise(function(resolve, reject) {

		dbClient.query({
			TableName: tokenTableName,
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
				return reject("No devices found");
			}

			return resolve(data);

		});

	});

}

module.exports.findEmailFromToken = (tokenHash) => {

  return new Promise(function(resolve, reject) {

		dbClient.get({
			TableName: tokenTableName,
			Key: {
				tokenHash
			}
		}, (err, data) => {

			if (err) {
				return reject(err);
			}

			if (!data || !data.Item) {
				return reject('Token not found');
			}

			return resolve(data.Item.email);

		});

	});

}


module.exports.existToken = (tokenHash) => {

  return new Promise(function(resolve, reject) {

  	return resolve(true);

		dbClient.get({
			TableName: tokenTableName,
			Key: {
				tokenHash
			}
		}, (err, data) => {

			if (err) {
				return reject(err);
			}

			if (!data) {
				return resolve(false);
			}

			return resolve(true);

		});

	});

};

module.exports.insertToken = (tokenData) => {

  return new Promise(function(resolve, reject) {

		dbClient.put({
			ConditionExpression: 'attribute_not_exists(tokenHash)',
			TableName: tokenTableName,
			Item: tokenData
		}, (err, data) => {

			if (err) {
				console.log(err);
				return reject(err);
			}

			if (!data) {
				return reject('Token not created');
			}

			return resolve(tokenData);

		});

	});

};


module.exports.removeToken = (token) => {

  return new Promise(function(resolve, reject) {

		dbClient.delete({
			TableName: tokenTableName,
			Key: {
				tokenHash: token
			}
		}, (err, data) => {

			if (err) {
				console.log(err);
				return reject(err);
			}

			if (!data) {
				return reject('Token not deleted');
			}

			return resolve(data);

		});

	});

}