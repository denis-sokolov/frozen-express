'use strict';

var express = require('express');

var frozen = require('..');
var util = require('./util.js');

var test = util.test(frozen, express);

/* global it */

it('should handle a call with no options', function(done){
	var app = express();
	frozen(app);
	done();
});

it('should not create files for an app with no routes', function(done){
	test(done)
		.results().then(function(results){
			if (results.length > 0) {
				done(new Error('Created files without routes'));
			} else {
				done();
			}
		});
});
