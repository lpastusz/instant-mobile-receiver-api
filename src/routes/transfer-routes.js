const
		TransferController = require('../controllers/transfer-controller');

module.exports = (app, routePrefix) => {

	app.post(routePrefix + '/text', (req, res, next) => {

		console.log(req.username);

		TransferController.uploadText(req.params.text)
			
		.then((data) => {	
			res.json({
				response: 'success',
				action: routePrefix + '/text',
				data: data
			});
		})

		.catch((err) => {
			res.json({
				response: 'error',
				action: routePrefix + '/text',
				error: err
			});
		});

	});

	app.post(routePrefix + '/file', (req, res, next) => {

		console.log(req.params);

		TransferController.uploadText("text")
			
		.then((data) => {	
			res.json({
				response: 'success',
				action: routePrefix + '/text',
				data: data
			});
		})

		.catch((err) => {
			res.json({
				response: 'error',
				action: routePrefix + '/text',
				error: err
			});
		});

	});

};