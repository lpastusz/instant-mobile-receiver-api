const
		ContentModel = require('../models/content-model')
	, _ = require('lodash');


module.exports.getForUser = (email) => {

	return new Promise(function(resolve, reject) {

		ContentModel.getByEmail(email)

		.then(resolve)

		.catch(reject);

	});

}


module.exports.getForDevice = (email, deviceId) => {

	return new Promise(function(resolve, reject) {

		ContentModel.getByEmail(email)

		.then(data => filterByDeviceId(data, deviceId))

		.then(resolve)

		.catch(reject);

	});

}


function filterByDeviceId(data, deviceId) {

		var result = [];
		data.Items.forEach(function(item) {
			if (item.deviceId && item.deviceId == deviceId)
		    result.push(item);
		});
		return result;
}
