const         
		crypto = require("crypto")

module.exports.generateToken = (salt, username) => {

	var str = username + ":" + salt;
  var random = Math.floor(Math.random() * 100001);
  var timestamp = (new Date()).getTime();
  var sha256 = crypto.createHmac("sha256", random + "WOO" + timestamp);

  return sha256.update(str).digest("base64");

}

module.exports.generateSalt = (length) => {

 return crypto.randomBytes(Math.ceil(length/2))
        		.toString('hex')
            .slice(0,length);

}

module.exports.generatePasswordHash = (salt, password) => {

  var hash = crypto.createHmac('sha512', salt);
  hash.update(password);
  var value = hash.digest('hex');
	return value;
}

