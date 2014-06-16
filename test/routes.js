'use strict';

var express = require('express');

var frozen = require('..');
var util = require('./util.js');

var test = util.test(frozen, express);

/* global it */

it('should detect a route by itself', function(done){
	test(done)
		.route('/hello', 'hello.html', 'Hello world!')
		.run({
			urls: null
		});
});

it('should detect multiple routes by itself', function(done){
	test(done)
		.route('/hello', 'hello.html', 'Hello world!')
		.route('/', 'index.html', 'Welcome!')
		.route('/goodbye', 'goodbye.html', 'Goodbye!')
		.run({
			urls: null
		});
});
