'use strict';

var frozen = require('../..');
var util = require('./lib/util.js');

var test = util.test(frozen);

util.it('should error on a 404', function(express, done){
	test(express, done)
		.run({urls:['/404']})
		.catch(function(err){
			if (err instanceof frozen.errors.ConfigurationError) done(); else done(err);
		});
});
