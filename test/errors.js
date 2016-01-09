'use strict';

var frozen = require('..');
var util = require('./lib/util.js');

var test = util.test(frozen);

util.it('should handle errors properly', function(express, done){
	test(express, done)
		.route('/', 'index.html', 'Hello!', function(res){
			res.status(500);
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

util.it('should handle wrong content type properly', function(express, done){
	test(express, done)
		.route('/', 'index.html', 'Hello!', function(res){
			res.set('content-type', 'application/fooqwiorjqwfw');
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

util.it('should inform if the URL is not routed', function(express, done){
	test(express, done)
		.app().then(function(app){
			frozen(app, { urls: ['/-non-existing'] })
				.on('error', function(error){
					if (error.message.indexOf('does not have a handler') > -1)
						return done();
					done(new Error('Does not properly inform'));
				})
				.on('finish', function(){
					done(new Error('Should not have finished successfully'));
				});
		});
});

util.it('should inform if the URL is not routed even with a weird status', function(express, done){
	test(express, done)
		.app().then(function(app){
			app.get(/.*/, function(req, res, next){
				res.status(404);
				next();
			});
			frozen(app, { urls: ['/-non-existing'] })
				.on('error', function(error){
					if (error.message.indexOf('Wrong status 404') > -1)
						return done();
					done(new Error('Does not properly inform'));
				})
				.on('finish', function(){
					done(new Error('Should not have finished successfully'));
				});
		});
});
