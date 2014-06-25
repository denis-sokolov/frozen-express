'use strict';

var fs = require('fs');

var Promise = require('promise');

var readFile = Promise.denodeify(fs.readFile);

module.exports = function(addFile) {
	return readFile(__dirname + '/apache/htaccess').then(function(contents){
		addFile({path:'.htaccess', contents: contents});
		return 1;
	});
};
