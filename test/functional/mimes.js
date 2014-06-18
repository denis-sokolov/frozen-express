'use strict';

var frozen = require('../..');
var util = require('./util.js');

var test = util.test(frozen);

util.it('should return a js file', function(express, done){
	test(express, done)
		.route('/scripts', 'scripts.js', '2+2', function(res){
			res.contentType('application/javascript');
		})
		.run();
});
