var through = require('through2');

module.exports = function() {
	var pipe = through.obj();
	pipe.push('Hello');
	pipe.end();
	return pipe;
};
