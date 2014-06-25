'use strict';

var express = require('express');
var express3 = require('express3');
var Promise = require('promise');
var through = require('through2');

var frozen = require('../../..');

var api = {};

var lib = {};

/**
 * Get the contents of a pipe
 * @param pipe
 * @return Promise([contents])
 */
lib.pipeContents = function(pipe){
	return new Promise(function(resolve, reject){
		var result = [];
		pipe.on('error', function(err){ reject(err); });
		pipe.pipe(through.obj(function(data, enc, next){
			result.push(data);
			next();
		}, function(){
			resolve(result);
		}));
	});
};

/**
 * Run a single test with multiple Express application versions
 * @param name
 * @param {Function} callback
 */
api.it = function(name, callback){
	/* global it */
	it('[express4] '+name, function(done){
		callback(express, done);
	});

	it('[express3] '+name, function(done){
		callback(express3, done);
	});
};

api.test = function(){
	return function(express, done){
		var app = express();

		var rethrow = false;
		var routes = [];
		var test = {};

		test.app = function(){
			return Promise.resolve(app);
		};

		test.rethrow = function(){
			rethrow = true;
			return test;
		};

		test.route = function(url, path, contents, handler){
			routes.push({
				url: url, path: path, contents: contents
			});
			app.get(url, function(req, res){
				if (handler) {
					handler(res);
				}
				res.send(contents);
			});
			return test;
		};

		test.results = function(options){
			options = options || {};
			if (options.urls !== null) {
				options.urls = options.urls || routes.map(function(route){
					return route.url;
				});
			}

			return test.app().then(function(app){
				return lib.pipeContents(frozen(app, options));
			});
		};

		test.run = function(options){
			options = options || {};
			var checkFiles = options.checkFiles || options.checkRoutes || routes;
			delete options.checkFiles;

			return test.results(options).then(function(results){
				var missing = checkFiles.filter(function(file){
					return !results.some(function(attempt){
						if (file.path !== attempt.relative) {
							return false;
						}
						if (file.contents && file.contents !== attempt.contents.toString()) {
							return false;
						}
						return true;
					});
				});
				if (missing.length) {
					console.warn('Did not find', missing, 'among', results);
					done(new Error('Did not find an expected item in the pipe'));
				} else {
					done();
				}
			}).catch(function(e){
				if (rethrow) throw e;
				done(e);
			});
		};

		return test;
	};
};

module.exports = api;
