'use strict';

var async         = require('async'),
	isArray       = require('lodash.isarray'),
	platform      = require('./platform'),
	isPlainObject = require('lodash.isplainobject'),
	keenClient, collection;

let sendData = function (data, callback) {
	keenClient.addEvent(collection, data, function (error) {
        if(error)
            callback(error);
        else {
            platform.log(JSON.stringify({
                title: 'Added Keen.io Data',
                collection: collection,
                data: data
            }));
        }
	});
};

platform.on('data', function (data) {
	if (isPlainObject(data)) {
		sendData(data, (error) => {
            if (error) platform.handleException(error);
		});
	}
	else if (isArray(data)) {
		async.each(data, (datum, done) => {
			sendData(datum, done);
		}, (error) => {
            if (error) platform.handleException(error);
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