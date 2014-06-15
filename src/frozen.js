'use strict';

var File = require('vinyl');
var mime = require('mime');
var Promise = require('promise');
var supertest = require('supertest');
var through = require('through2');

var errors = require('./errors.js');

module.exports = function(app, options) {
	options = options || {};
	options.urls = options.urls || [];

	var pipe = through.obj();
	var promises = [];

	app.use(function(req){
		pipe.emit('error', new errors.ConfigurationError(
			'URL '+req.originalUrl+' does not have a handler.'
		));
	});

	options.urls.forEach(function(url){
		promises.push(new Promise(function(resolve){
			supertest(app).get(url).end(function(err, res){
				if (/\/$/.exec(url))
					url += 'index';

				var correctExt = mime.extension(res.get('content-type'));
				if (correctExt !== 'bin' && mime.extension(mime.lookup(url)) !== correctExt)
					url += '.' + correctExt;

				pipe.push(new File({
					contents: new Buffer(res.text),
					path: process.cwd() + url,
					base: process.cwd()
				}));
				resolve();
			});
		}));
	});

	Promise.all(promises).then(function(){
		pipe.end();
	});

	return pipe;
};

module.exports.errors = errors;
