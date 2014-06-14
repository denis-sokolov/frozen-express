'use strict';

var express = require('express');

var frozen = require('..');
var util = require('./util.js');

var test = util.test(frozen, express);

/* global it */

it('should return a single static file', function(done){
	test(done)
		.route('/hello', 'hello.html', 'Hello world!')
		.run();
});

it('should return two static files', function(done){
	test(done)
		.route('/hello', 'hello.html', 'Hello world!')
		.route('/goodbye', 'goodbye.html', 'Goodbye!')
		.run();
});

it('should return static files only for given routes', function(done){
	test(done)
		.route('/hello', 'hello.html', 'Hello world!')
		.route('/goodbye', 'goodbye.html', 'Goodbye!')
		.results({urls:['/hello']}).then(function(results){
			if (results.length > 1) {
				done(new Error('Generated too many results'));
			} else {
				done();
			}
		});
});

it('should handle root index path', function(done){
	test(done)
		.route('/', 'index.html', 'Hello world!')
		.run();
});
