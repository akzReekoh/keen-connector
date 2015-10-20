'use strict';

const PROJECT_ID = '560db78dd2eaaa7968e3229b',
	  WRITE_KEY  = 'c9d25c945c7b15dee078343a593f41f6761be5c25ef99253c5b4628042b3cb0799cdf64d0e0ac79607a5fd4eff921c86932b3240d20db12613abbc7f363beffb4a6e35563d14eed991dd41408b33900b88c80e80849bdc1eea4ae8b4194929b587c0d3ded06d42a1ad34b928dd774600',
	  COLLECTION = 'reekoh-data';

var cp     = require('child_process'),
	should = require('should'),
	connector;

describe('Connector', function () {
	this.slow(8000);

	after('terminate child process', function () {
		this.timeout(5000);

		setTimeout(function () {
			connector.kill('SIGKILL');
		}, 4000);
	});

	describe('#spawn', function () {
		it('should spawn a child process', function () {
			should.ok(connector = cp.fork(process.cwd()), 'Child process not spawned.');
		});
	});

	describe('#handShake', function () {
		it('should notify the parent process when ready within 5 seconds', function (done) {
			this.timeout(8000);

			connector.on('message', function (message) {
				if (message.type === 'ready')
					done();
			});

			connector.send({
				type: 'ready',
				data: {
					options: {
						project_id: PROJECT_ID,
						write_key: WRITE_KEY,
						collection: COLLECTION
					}
				}
			}, function (error) {
				should.ifError(error);
			});
		});
	});

	describe('#data', function (done) {
		it('should process and send the data to the keen.io collection', function () {
			connector.send({
				type: 'data',
				data: {
					key1: 'value1',
					key2: 121,
					key3: 40
				}
			}, done);
		});
	});
});