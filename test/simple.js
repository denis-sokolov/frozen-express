'use strict';

var assert = require('better-assert');
var express = require('express');
var through = require('through2');

var frozen = require('..');

/* global describe, it */

describe('simplest use cases', function(){
	it('should return a single static file', function(done){
		var result = [];

		var pipe = through.obj(function(data, enc, next){
			result.push(data);
			next();
		}, function(){
			assert(result.length === 1);
			assert(result[0].path.substr(result[0].base.length) === '/hello.html');
			assert(result[0].contents.toString() === 'Hello world!');
			done();
		});

		var app = express();
		app.get('/hello', function(req, res){
			res.send('Hello world!');
		});
		frozen(app, {
			routes: ['/hello']
		}).pipe(pipe);
	});
});
