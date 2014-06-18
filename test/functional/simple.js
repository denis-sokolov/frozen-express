'use strict';

var frozen = require('../..');
var util = require('./lib/util.js');

var test = util.test(frozen);

util.it('should return a single static file', function(express, done){
	test(express, done)
		.route('/hello', 'hello.html', 'Hello world!')
		.run();
});

util.it('should return two static files', function(express, done){
	test(express, done)
		.route('/hello', 'hello.html', 'Hello world!')
		.route('/goodbye', 'goodbye.html', 'Goodbye!')
		.run();
});

util.it('should return static files only for given routes', function(express, done){
	test(express, done)
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

util.it('should handle root index path', function(express, done){
	test(express, done)
		.route('/', 'index.html', 'Hello world!')
		.run();
});
