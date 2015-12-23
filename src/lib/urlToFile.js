'use strict';

var mime = require('mime');
var Promise = require('promise');
var supertest = require('supertest');

/**
 * Transform an Express app and the URL into the contents of that response
 * @param Express app
 * @param string url
 * @param options options
 * @return {
 *   path: string path to the resulting file, potentially including its extension
 *   contents: string
 * }
 */
module.exports = function(app, url, options){
	options = options || {};
	options.expectedStatus = options.expectedStatus || [200, 300];

	return new Promise(function(resolve, reject){
		supertest(app).get(encodeURI(url)).end(function(err, res){
			if (err && err.status !== 404) return reject(err);
			var correctStatus = options.expectedStatus[0] <= res.statusCode &&
				res.statusCode < options.expectedStatus[1];
			if (!correctStatus)
				return reject(new Error('Wrong status ' + res.statusCode + ' for ' + url));

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
				contents: res.text || res.body
			});
		});
	});
};
