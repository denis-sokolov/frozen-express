'use strict';

var frozen = require('../..');
var util = require('./lib/util.js');

var test = util.test(frozen);

util.it('should create an .htaccess file when asked for', function(express, done){
	test(express, done)
		.route('/', 'index.html', 'Hello!')
		.run({
			checkFiles: [{path:'.htaccess'}],
			server: 'apache'
		});
});

util.it('should create an .htaccess file even if no routes', function(express, done){
	test(express, done)
		.run({
			checkFiles: [{path:'.htaccess'}],
			server: 'apache'
		});
});
