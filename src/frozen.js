'use strict';

var File = require('vinyl');
var Promise = require('promise');
var through = require('through2');

var errors = require('./errors.js');
var servers = {
	apache: require('./servers/apache.js')
};
var routes = require('./lib/routes.js');
var urlToFile = require('./lib/urlToFile.js');

var unhandled = 'FROZEN_UNHANDLED';

module.exports = function(app, options) {
	options = options || {};
	if (options.server && !(options.server in servers))
		throw new errors.ConfigurationError('Invalid server setting');
	options.urls = options.urls || routes.detectUrls(app);

	var pipe = through.obj();

	var addFile = function(f) {
		var path = f.path;
		if (path.substr(0, 1) !== '/') {
			path = '/' + path;
		}
		pipe.push(new File({
			contents: new Buffer(f.contents),
			path: process.cwd() + path,
			base: process.cwd()
		}));
	};

	var promises = [];

	// Express does not seem to provide API to unregister handlers
	// Work around that with done + next
	var done = false;
	app.use(function(req, res, next){
		if (done) return next();
		res.send(unhandled);
	});

	options.urls.forEach(function(url){
		promises.push(urlToFile(app, url).then(function(f){
			if (f.contents === unhandled)
				return Promise.reject(new errors.ConfigurationError(
					'URL '+url+' does not have a handler.'
				));
			addFile(f);
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
