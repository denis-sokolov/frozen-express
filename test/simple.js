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
});
