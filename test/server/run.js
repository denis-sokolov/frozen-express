'use strict';

var request = require('request');

var base_url = process.env.FROZEN_TEST_URL;
if (!base_url) {
	throw new Error('Set FROZEN_TEST_URL env variable');
}
if (base_url.substr(-1, 1) !== '/') {
	base_url += '/';
}

/* global it */

var test = function(name, url, status, options) {
	options = options || {};
	it(name, function(done){
		request(base_url + url, function(err, response, body){
			if (err) return done(err);

			if (response.statusCode !== status)
				return done(new Error('code '+response.statusCode+' should be '+status));

			if (options.body && options.body !== body) {
				return done(new Error('body wrong: '+body));
			}

			done();
		});
	});
};


test('replies for / URLs', '', 200, 'Welcome');
test('does not reply for index URLs', 'index', 404);
test('replies for URLs without exceptions', 'about', 200, 'About us');
test('does not reply for URLs with extensions', 'about.html', 404);
