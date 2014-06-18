'use strict';

var frozen = require('../..');
var util = require('./util.js');

var test = util.test(frozen);

util.it('should not double the extension', function(express, done){
	test(express, done)
		.route('/scripts.js', 'scripts.js', '2+2', function(res){
			res.set('content-type', 'application/javascript');
		})
		.run();
});

util.it('should not double similar extensions', function(express, done){
	test(express, done)
		.route('/foo.htm', 'foo.htm', 'Hello')
		.run();
});

util.it('should handle binary files smarter', function(express, done){
	test(express, done)
		.route('/foo.zip', 'foo.zip', 'abc', function(res){
			res.set('content-type', 'application/octet-stream');
		})
		.run();
});
