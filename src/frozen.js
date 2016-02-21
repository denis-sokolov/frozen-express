'use strict';

var arrayUnique = require('array-unique');
var File = require('vinyl');
var queue = require('queue');
var through = require('through2');

var errors = require('./errors.js');
var routes = require('./lib/routes.js');
var urlToFile = require('./lib/urlToFile.js');

var unhandled = 'FROZEN_UNHANDLED';

module.exports = function(app, options) {
	options = options || {};
	options.urls = options.urls || routes.detectUrls(app);

	var pipe = through.obj();

	var addFile = function(f) {
		var path = f.path;
		if (path.substr(0, 1) !== '/') {
			path = '/' + path;
		}

		pipe.push(new File({
			contents: f.contents,
			path: process.cwd() + path,
			base: process.cwd()
		}));
	};

	var q = queue();

	// Express does not seem to provide API to unregister handlers
	// Work around that with done + next
	var done = false;
	app.use(function(req, res, next){
		if (done) return next();
		res.send(unhandled);
	});

	arrayUnique(options.urls).forEach(function(url){
		q.push(function(cb){
			urlToFile(app, url)
				.then(function(res){
					if (res.contents.toString() === unhandled)
						throw new errors.ConfigurationError(
							'URL ' + url + ' does not have a handler.'
						);
					addFile(res);
				}, function(err){
					if (err.message === unhandled)
						throw new errors.ConfigurationError(
							'URL ' + url + ' does not have a handler.'
						);
					throw err;
				})
				.then(cb, cb);
		});
	});

	// Force async return. queue returns synchronously if no jobs :(
	q.push(function(cb){ setTimeout(cb, 1); });

	// Slow down. If supertest is overwhelmed with jobs,
	// "socket hang up" happens.
	q.concurrency = 5;

	q.start(function(err){
		done = true;
		if (err)
			pipe.emit('error', err);
		else
			pipe.end();
	});

	return pipe;
};

module.exports.errors = errors;
