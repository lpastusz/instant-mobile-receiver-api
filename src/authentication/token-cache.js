const
		NodeCache =require('node-cache');

const TokenCache = new NodeCache({
	stdTTL: 86400,
	checkperiod: 3600
});


module.exports.storeToken = (tokenData) => {

	TokenCache.set(tokenData.tokenHash, tokenData.email);

};

module.exports.getEmailForToken = (token) => {

	return new Promise(function(resolve, reject) {

		TokenCache.get(token, (err, value) => {
			if (err || value === undefined) {
				return reject(err);
			}
			else {
				return resolve(value);
			}
		});

	});
	

};

module.exports.removeToken = (token) => {

	TokenCache.del(token);

};