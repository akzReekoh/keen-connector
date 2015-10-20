'use strict';

var platform = require('./platform'),
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
 * Listen for the ready event.
 */
platform.once('ready', function (options) {
	var Keen = require('keen-js');

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