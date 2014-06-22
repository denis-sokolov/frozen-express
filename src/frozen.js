'use strict';

var fs = require('fs');

var File = require('vinyl');
var mime = require('mime');
var Promise = require('promise');
var supertest = require('supertest');
var through = require('through2');

var errors = require('./errors.js');
var routes = require('./lib/routes.js');

var readFile = Promise.denodeify(fs.readFile);
var unhandled = 'FROZEN_UNHANDLED';

module.exports = function(app, options) {
	options = options || {};
	options.htaccess = !!options.htaccess;
	options.urls = options.urls || routes.detectUrls(app);

	var pipe = through.obj();
	var promises = [];

	app.use(function(req, res){
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

	options.urls.forEach(function(url){
		promises.push(new Promise(function(resolve, reject){
			supertest(app).get(url).end(function(err, res){
				if (res.text === unhandled)
					return reject(new errors.ConfigurationError(
						'URL '+url+' does not have a handler.'
					));

				if (/\/$/.exec(url))
					url += 'index';
				var correctExt = mime.extension(res.get('content-type'));
				if (!correctExt)
					reject(new Error('Strange content type', res.get('content-type')));
				if (correctExt !== 'bin' && mime.extension(mime.lookup(url)) !== correctExt)
					url += '.' + correctExt;

				addFile(url, res.text);
				resolve();
			});
		}));
	});

	if (options.htaccess) {
		promises.push(readFile(__dirname + '/server/htaccess').then(function(contents){
			addFile('.htaccess', contents);
		}));
	}

	Promise.all(promises).then(function(){
		pipe.end();
	}).catch(function(err){
		pipe.emit('error', err);
	});

	return pipe;
};

module.exports.errors = errors;
