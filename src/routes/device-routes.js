const
		DeviceController = require('../controllers/device-controller');

module.exports = (app, routePrefix) => {

	app.get(routePrefix + '/get', (req, res, next) => {

		DeviceController.getDeviceForCurrentUser(req.username)
			
		.then((data) => {	
			res.json({
				response: 'success',
				action: routePrefix + '/get',
				data: data
			});
		})

		.catch((err) => {
			res.json({
				response: 'error',
				action: routePrefix + '/get',
				error: err
			});
		});

	});

}