const
		TransferController = require('../controllers/transfer-controller')
	,	fs = require('fs')
	, BusBoy = require('busboy')
	, restify = require('restify');

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


app.post(routePrefix + '/file', uploadFile);    

function uploadFile(req, res, next) { 
console.log('begin');
var busboy = new Busboy({ headers: req.headers });
req.pipe(busboy);
busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
    console.log('file');
    audioFileName = filename + ".ogg";
    var saveTo = path.join("audio_temp", path.basename(audioFileName));
    file.pipe(fs.createWriteStream(saveTo));
});
busboy.on('finish', function() {
   	console.log('finish');
});

}

/*
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
*/
};