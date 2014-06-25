'use strict';

var File = require('vinyl');
var mime = require('mime');
var Promise = require('promise');
var supertest = require('supertest');
var through = require('through2');

var errors = require('./errors.js');
var servers = {
	apache: require('./servers/apache.js')
};
var routes = require('./lib/routes.js');

var unhandled = 'FROZEN_UNHANDLED';

module.exports = function(app, options) {
	options = options || {};
	if (options.server && !(options.server in servers))
		throw new errors.ConfigurationError('Invalid server setting');
	options.urls = options.urls || routes.detectUrls(app);

	var pipe = through.obj();
	var promises = [];

	// Express does not seem to provide API to unregister handlers
	// Work around that with done + next
	var done = false;
	app.use(function(req, res, next){
		if (done) return next();
		res.send(unhandled);
	});

	var addFile = function(path, contents) {
		if (path.substr(0, 1) !== '/') {
			path = '/' + path;
		}
		pipe.push(new File({
			contents: new Buffer(contents),
			path: process.cwd() + path,
			base: process.cwd()
		}));
	};

	var resolveUrlToFile = function(url){
		return new Promise(function(resolve, reject){
			supertest(app).get(url).end(function(err, res){
				if (res.text === unhandled)
					return reject(new errors.ConfigurationError(
						'URL '+url+' does not have a handler.'
					));

				if (res.statusCode > 299)
					return reject(new Error(res.text));

				var path = url;
				if (/\/$/.exec(path))
					path += 'index';
				var correctExt = mime.extension(res.get('content-type'));
				if (!correctExt)
					reject(new Error('Strange content type', res.get('content-type')));
				if (correctExt !== 'bin' && mime.extension(mime.lookup(path)) !== correctExt)
					path += '.' + correctExt;

				resolve({
					path: path,
					contents: res.text
				});
			});
		});
	};

	options.urls.forEach(function(url){
		promises.push(resolveUrlToFile(url).then(function(f){
			addFile(f.path, f.contents);
		}));
	});

	if (options.server) {
		promises.push(servers[options.server](addFile));
	}

	Promise.all(promises).then(function(){
		pipe.end();
		done = true;
	}).catch(function(err){
		pipe.emit('error', err);
	});

	return pipe;
};

module.exports.errors = errors;
