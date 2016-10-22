const
		TokenModel = require('../models/token-model')
	, _ = require('lodash');


module.exports.getDeviceForCurrentUser = (email) => {

	return new Promise(function(resolve, reject) {

		TokenModel.getForEmail(email)

		.then(extractMobileDataFromItems)

		.then(resolve)

		.catch(reject);

	});

}

function extractMobileDataFromItems(data) {

	return new Promise(function(resolve, reject) {

		var result = [];
		data.Items.forEach(function(item) {
		    result.push({
		    	deviceId: item.mobileDevice.deviceId,
		    	deviceName: item.mobileDevice.deviceName
		    });
		});

		return resolve(result);

	});

};