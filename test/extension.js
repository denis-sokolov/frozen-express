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

it('should not double similar extensions', function(done){
	test(done)
		.route('/foo.htm', 'foo.htm', 'Hello')
		.run();
});

it('should handle binary files smarter', function(done){
	test(done)
		.route('/foo.zip', 'foo.zip', 'abc', function(res){
			res.set('content-type', 'application/octet-stream');
		})
		.run();
});
