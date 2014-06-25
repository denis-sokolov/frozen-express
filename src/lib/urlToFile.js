'use strict';

var mime = require('mime');
var Promise = require('promise');
var supertest = require('supertest');

module.exports = function(app, url, options){
	options = options || {};
	options.expectedStatus = options.expectedStatus || [200, 300];

	return new Promise(function(resolve, reject){
		supertest(app).get(url).end(function(err, res){
			var correctStatus = options.expectedStatus[0] <= res.statusCode &&
				res.statusCode < options.expectedStatus[1];
			if (!correctStatus)
				return reject(new Error(res.text));

			var path = url;
			if (/\/$/.exec(path))
				path += 'index';
			var correctExt = mime.extension(res.get('content-type'));
			if (!correctExt)
				reject(new Error('Strange content type', res.get('content-type')));
			if (correctExt !== 'bin' && mime.extension(mime.lookup(path)) !== correctExt)
				path += '.' + correctExt;

			resolve({
				path: path,
				contents: res.text
			});
		});
	});
};
