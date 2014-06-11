'use strict';

var assert = require('better-assert');
var through = require('through2');

var frozen = require('..');

/* global describe, it */

describe('simplest use cases', function(){
	it('should return a single static html file', function(done){
		var result = [];

		var pipe = through.obj(function(data, enc, next){
			result.push(data);
			next();
		}, function(){
			assert(result.length === 1);
			done();
		});

		frozen({}).pipe(pipe);
	});
});
