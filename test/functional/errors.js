'use strict';

var frozen = require('../..');
var util = require('./lib/util.js');

var test = util.test(frozen);

util.it('should handle errors properly', function(express, done){
	test(express, done)
		.route('/', 'index.html', 'Hello!', function(res){
			res.set('content-type', 'WRONG CONTENT_TYPE');
		})
		.app().then(function(app){
			frozen(app)
				.on('error', function(){
					done();
				})
				.on('finish', function(){
					done(new Error('Should not have finished successfully'));
				});
		});
});

util.it('should throw an error if server option is invalid', function(express, done){
	test(express, done).app().then(function(app){
		try {
			frozen(app, {server: 'invalid'});
		} catch (e) {
			if (e instanceof frozen.errors.ConfigurationError) {
				return done();
			}
			return done(e);
		}
		done(new Error('Should not have finished successfully'));
	});
});
