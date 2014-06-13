'use strict';

var through = require('through2');

var api = {};

api.checkPipeContents = function(pipe, contents, done){
	var result = [];

	pipe.pipe(through.obj(function(data, enc, next){
		result.push(data);
		next();
	}, function(){
		if (contents.length !== result.length) {
			throw new Error('Expected '+contents.length+' items, got '+result.length);
		}
		contents.forEach(function(target){
			var found = result.some(function(attempt){
				if (target.path && attempt.relative !== target.path) {
					return false;
				}
				if (target.contents && attempt.contents.toString() !== target.contents) {
					return false;
				}
				return true;
			});
			if (!found) {
				console.warn('Did not find', target, 'among', contents);
				throw new Error('Did not find an expected item in the pipe');
			}
		});
		done();
	}));
};


module.exports = api;
