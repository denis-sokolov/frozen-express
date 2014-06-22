'use strict';

var supertest = require('supertest');

var frozen = require('../..');
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

util.it('should not add new handlers on 404', function(express, done){
	var app = express();

	// Express 4 blows up if we try to access a 404 that is not set up
	// This means tricky to test that it has been modified.
	// next() works as a crappy workaround.
	app.use(function(req, res, next){ next(); });

	supertest(app).get('/').end(function(err, firstRes){
		if (err) return done(err);
		frozen(app).on('finish', function(){
			supertest(app).get('/').end(function(err, secondRes){
				if (err) return done(err);
				if (firstRes.statusCode !== secondRes.statusCode)
					return done(new Error('Modified status code'));
				if (firstRes.text !== secondRes.text)
					return done(new Error('Modified body'));
				done();
			});
		});
	});
});
