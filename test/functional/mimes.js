'use strict';

var frozen = require('../..');
var util = require('./lib/util.js');

var test = util.test(frozen);

util.it('should return a js file', function(express, done){
	test(express, done)
		.route('/scripts', 'scripts.js', '2+2', function(res){
			res.contentType('application/javascript');
		})
		.run();
});

util.it('should return an image file', function(express, done){
	test(express, done)
		.route('/foo.png', 'foo.png', new Buffer('foobar'), function(res){
			res.contentType('image/png');
		})
		.run();
});
