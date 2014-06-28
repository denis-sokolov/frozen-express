'use strict';

var fs = require('fs');

var Promise = require('promise');

var readFile = Promise.denodeify(fs.readFile);

var errors = require('../errors');

module.exports = function(env) {
	if (!env.base)
		throw new errors.ConfigurationError('server:apache requires a base option');

	return readFile(__dirname + '/apache/htaccess').then(function(contents){
		contents = contents.toString().replace(/FROZENBASE/g, env.base);
		env.addFile({path:'.htaccess', contents: contents});
		return 1;
	});
};
