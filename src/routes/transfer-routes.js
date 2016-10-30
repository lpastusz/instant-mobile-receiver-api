"use strict";

const
		TransferController = require('../controllers/transfer-controller')
	, FileTransferController = require('../controllers/file-transfer-controller')
	,	fs = require('fs')
	, BusBoy = require('busboy')
	, restify = require('restify');

module.exports = (app, routePrefix) => {

	app.post(routePrefix + '/text', (req, res, next) => {

		let username = req.username;
		let text = req.params.text;
		let deviceId = req.params.deviceId;

		TransferController.uploadText(username, text, deviceId)
			
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



	app.post(routePrefix + '/file/text', (req, res, next) => {

		let username = req.username;

		let fileUrl = req.params.fileUrl;
		let fileName = req.params.fileName;
		let deviceId = req.params.deviceId;

		FileTransferController.handleTextFile(username, fileUrl, fileName, deviceId)
			
		.then((data) => {	
			res.json({
				response: 'success',
				action: routePrefix + '/file/text',
				data: data
			});
		})

		.catch((err) => {
			res.json({
				response: 'error',
				action: routePrefix + '/file/text',
				error: err
			});
		});

	});


};