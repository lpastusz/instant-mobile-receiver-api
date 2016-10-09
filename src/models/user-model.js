const
		dbClient = require('db').documentClient
	, userTableName = require('db').getTableName('user');


module.exports.createUser = (user) => {

  return new Promise(function(resolve, reject) {

		dbClient.put({
			ConditionExpression: 'attribute_not_exists(email)',
			TableName: userTableName,
			Item: user
		}, (err, data) => {

			if (err) {
				return reject(err);
			}

			if (!data || !data.Item) {
				return reject('User not created');
			}

			return resolve(data.Item);

		});

	});

};


module.exports.getUserByEmail = (email) => {

  return new Promise(function(resolve, reject) {

		dbClient.get({
			TableName: userTableName,
			Key: {
				email
			}
		}, (err, data) => {

			if (err) {
				return reject(err);
			}

			if (!data || !data.Item) {
				return reject('User not found');
			}

			return resolve(data.Item);

		});

	});

};

