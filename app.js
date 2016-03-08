'use strict';

var _        = require('lodash'),
	platform = require('./platform'),
	async = require('async'),
	keenClient, collection;

let sendData = (data) => {
	keenClient.addEvent(collection, data, function (error) {
		if (error) return platform.handleException(error);

		platform.log(JSON.stringify({
			title: 'Added Keen.io Data',
			collection: collection,
			data: data
		}));
	});
};

platform.on('data', function (data) {
	if (_.isPlainObject(data)) {
		sendData(data);
	}
	else if(_.isArray(data)){
		async.each(data, (datum) => {
			sendData(datum);
		});
	}
	else
		platform.handleException(new Error('Invalid data received. Must be a valid Array/JSON Object. Data ' + data));
});

platform.on('close', function () {
	platform.notifyClose(); // No resources to clean up. Just notify the platform.
});

platform.once('ready', function (options) {
	collection = options.collection;

	var Keen = require('keen-js');

	keenClient = new Keen({
		projectId: options.project_id,
		writeKey: options.write_key,
		protocol: 'https',
		requestType: 'jsonp'
	});

	platform.log('Keen.io Connector Initialized.');
	platform.notifyReady();
});