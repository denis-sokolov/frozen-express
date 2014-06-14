'use strict';

var express = require('express');

var frozen = require('..');
var util = require('./util.js');

var test = util.test(frozen, express);

/* global it */

it('should error on a 404', function(done){
	test(done)
		.run({urls:['/404']})
		.catch(function(err){
			if (err instanceof frozen.errors.ConfigurationError) done(); else done(err);
		});
});
