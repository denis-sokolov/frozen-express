'use strict';

var express = require('express');

var frozen = require('..');
var util = require('./util.js');

var test = util.test(frozen, express);

/* global it */

it('should return a js file', function(done){
	test(done)
		.route('/scripts', 'scripts.js', '2+2', function(res){
			res.contentType('application/javascript');
		})
		.run();
});
