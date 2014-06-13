'use strict';

var File = require('vinyl');
var Promise = require('promise');
var supertest = require('supertest');
var through = require('through2');

module.exports = function(app, options) {
	options = options || {};
	options.routes = options.routes || [];

	var pipe = through.obj();
	var promises = [];

	options.routes.forEach(function(route){
		promises.push(new Promise(function(resolve){
			supertest(app).get(route).end(function(err, res){
				pipe.push(new File({
					contents: new Buffer(res.text),
					path: process.cwd() + route + '.html',
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