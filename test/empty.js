'use strict';

var frozen = require('..');
var util = require('./util.js');

var test = util.test(frozen);

util.it('should handle a call with no options', function(express, done){
	var app = express();
	frozen(app);
	done();
});

util.it('should not create files for an app with no routes', function(express, done){
	test(express, done)
		.results().then(function(results){
			if (results.length > 0) {
				done(new Error('Created files without routes'));
			} else {
				done();
			}
		});
});

util.it('should not create files when urls are set to none', function(express, done){
	test(express, done)
		.route('/', 'index.html', 'Hello!')
		.results({urls: []}).then(function(results){
			if (results.length > 0) {
				done(new Error('Created files when not asked'));
			} else {
				done();
			}
		});
});
