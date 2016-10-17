module.exports = (app) => {

	app.get('/', (req, res, next) => {
		return res.send("Homepage");
	})



	require('./user-routes')(app, '/api/user');

	require('./transfer-routes')(app, '/api/transfer');

}