'use strict';

var supertest = require('supertest');

var frozen = require('..');
var util = require('./lib/util.js');

var test = util.test(frozen);

util.it('should error on a 404', function(express, done){
	test(express, done)
		.rethrow()
		.run({urls:['/404']})
		.catch(function(err){
			if (err instanceof frozen.errors.ConfigurationError) done(); else done(err);
		});
});

var testForMissing404 = function(express, done, run){
	var app = express();

	// Express 4 blows up if we try to access a 404 that is not set up
	// This means tricky to test that it has been modified.
	// next() works as a crappy workaround.
	app.use(function(req, res, next){ next(); });

	supertest(app).get('/').end(function(err, firstRes){
		if (err && err.status !== 404) return done(err);
		run(app, function(){
			supertest(app).get('/').end(function(err, secondRes){
				if (err && err.status !== 404) return done(err);
				if (firstRes.statusCode !== secondRes.statusCode)
					return done(new Error('Modified status code'));
				if (firstRes.text !== secondRes.text)
					return done(new Error('Modified body'));
				done();
			});
		});
	});
};

util.it('should not add new handlers on 404', function(express, done){
	testForMissing404(express, done, function(app, callback){
		frozen(app).on('finish', callback);
	});
});
util.it('should not add new handlers on 404 after frozen error', function(express, done){
	testForMissing404(express, done, function(app, callback){
		app.get('/foo', function(req, res){
			res.set('content-type', 'application/efwfoiwenoi');
			res.send('foo');
		});
		frozen(app, {urls:['/foo']})
			.on('finish', function(){ done(new Error('Not supposed to finish succesfully')); })
			.on('error', callback);
	});
});
