const
		ContentController = require('../controllers/content-controller');

module.exports = (app, routePrefix) => {

	app.get(routePrefix + '/get/by-user', (req, res, next) => {

		ContentController.getForUser(req.username)
			
		.then((data) => {	
			res.json({
				response: 'success',
				action: routePrefix + '/get/by-user',
				data: data
			});
		})

		.catch((err) => {
			res.json({
				response: 'error',
				action: routePrefix + '/get/by-user',
				error: err
			});
		});

	});


	app.get(routePrefix + '/get/by-device/:deviceId', (req, res, next) => {

		ContentController.getForDevice(req.username, req.params.deviceId)
			
		.then((data) => {	
			res.json({
				response: 'success',
				action: routePrefix + '/get/by-device/:deviceId',
				data: data
			});
		})

		.catch((err) => {
			res.json({
				response: 'error',
				action: routePrefix + '/get/by-device/:deviceId',
				error: err
			});
		});

	});	

}