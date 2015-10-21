'use strict';

var Keen     = require('keen-js'),
	platform = require('./platform'),
	keenClient, collection;

/*
 * Listen for the data event.
 */
platform.on('data', function (data) {
	var isJSON = require('is-json');

	if (isJSON(data, true)) {
		keenClient.addEvent(collection, data, function (error) {
			if (error) return platform.handleException(error);

			platform.log(JSON.stringify({
				title: 'Added Keen.io Data',
				collection: collection,
				data: data
			}));
		});
	}
	else
		platform.handleException(new Error('Invalid data received. ' + data));
});

/*
 * Event to listen to in order to gracefully release all resources bound to this service.
 */
platform.on('close', function () {
	platform.notifyClose(); // No resources to clean up. Just notify the platform.
});

/*
 * Listen for the ready event.
 */
platform.once('ready', function (options) {
	collection = options.collection;

	keenClient = new Keen({
		projectId: options.project_id,
		writeKey: options.write_key,
		protocol: 'https',
		requestType: 'jsonp'
	});

	platform.log('Keen.io Connector Initialized.');
	platform.notifyReady();
});