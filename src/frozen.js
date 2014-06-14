'use strict';

var File = require('vinyl');
var mime = require('mime');
var Promise = require('promise');
var supertest = require('supertest');
var through = require('through2');


module.exports = function(app, options) {
	options = options || {};
	options.urls = options.urls || [];

	var pipe = through.obj();
	var promises = [];

	options.urls.forEach(function(url){
		promises.push(new Promise(function(resolve){
			supertest(app).get(url).end(function(err, res){
				if (/\/$/.exec(url))
					url += 'index';
				pipe.push(new File({
					contents: new Buffer(res.text),
					path: process.cwd() + url + '.' + mime.extension(res.get('content-type')),
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
