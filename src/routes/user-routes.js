const
		UserController = require('../controllers/user-controller');

module.exports = (app, routePrefix) => {

	app.post(routePrefix + '/register', (req, res, next) => {

		UserController.registerUser(req.params.email, req.params.password)
			
		.then((data) => {	
			res.json({
				response: 'success',
				action: routePrefix + '/register',
				data: data
			});
		})

		.catch((err) => {
			res.json({
				response: 'error',
				action: routePrefix + '/register',
				error: err
			});
		});

	});


	app.post(routePrefix + '/logout', (req, res, next) => {

		UserController.logoutUser(req.authorization.credentials)

		.then((data) => {
			res.json({
				response: 'success',
				action: routePrefix + '/logout',
				data: data
			});
		})

		.catch((err) => {
				res.json({
				response: 'error',
				action: routePrefix + '/logout',
				error: err
			});
		})

	});	

}