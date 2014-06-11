'use strict';

var File = require('vinyl');
var supertest = require('supertest');
var through = require('through2');

module.exports = function(app, options) {
	options = options || {};
	options.routes = options.routes || [];

	var pipe = through.obj();

	options.routes.forEach(function(route){
		supertest(app).get(route).end(function(err, res){
			pipe.push(new File({
				contents: new Buffer(res.text),
				path: process.cwd() + route + '.html',
				base: process.cwd()
			}));
			pipe.end();
		});
	});

	return pipe;
};
