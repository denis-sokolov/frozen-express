'use strict';

var express = require('express');

var frozen = require('..');
var util = require('./util.js');

/* global describe, it */

var lib = {
	hello: {
		register: function(app) {
			app.get(this.path, function(req, res) {
				res.send('Hello world!');
			});
		},
		path: '/hello',
		expect: {path: 'hello.html', contents: 'Hello world!'}
	},
	index: {
		register: function(app) {
			app.get(this.path, function(req, res){
				res.send('Welcome!');
			});
		},
		path: '/',
		expect: {path: 'index.html', contents: 'Welcome!'}
	},
	goodbye: {
		register: function(app) {
			app.get(this.path, function(req, res){
				res.send('Goodbye!');
			});
		},
		path: '/goodbye',
		expect: {path: 'goodbye.html', contents: 'Goodbye!'}
	}
};

describe('simplest use cases', function(){
	it('should return a single static file', function(done){
		var app = express();
		lib.hello.register(app);
		util.checkPipeContents(
			frozen(app, {routes: [lib.hello.path]}),
			[lib.hello.expect],
			done
		);
	});

	it('should return two static files', function(done){
		var app = express();
		lib.hello.register(app);
		lib.goodbye.register(app);
		util.checkPipeContents(
			frozen(app, {routes: [lib.goodbye.path, lib.hello.path]}),
			[lib.hello.expect, lib.goodbye.expect],
			done
		);
	});

	it('should handle root index path', function(done){
		var app = express();
		lib.index.register(app);
		util.checkPipeContents(
			frozen(app, {routes: [lib.index.path]}),
			[lib.index.expect],
			done
		);
	});
});
