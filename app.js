'use strict';

var Keen     = require('keen-js'),
	platform = require('./platform'),
	keenClient, collection;

/*
 * Listen for the data event.
 */
platform.on('data', function (data) {
	keenClient.addEvent(collection, data, function (error) {
		if (error) return platform.handleException(error);
	});
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

	platform.notifyReady();
});