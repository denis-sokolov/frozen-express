'use strict';

var express = require('express');

var frozen = require('..');
var util = require('./util.js');

var test = util.test(frozen, express);

/* global it */

it('should not double the extension', function(done){
	test(done)
		.route('/scripts.js', 'scripts.js', '2+2', function(res){
			res.set('content-type', 'application/javascript');
		})
		.run();
});

