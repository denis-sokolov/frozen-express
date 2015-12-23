'use strict';
/* eslint no-console: 0 */

var fs = require('fs');

var argparse = require('argparse');
var gulp = require('gulp');

var frozen = require('..');

var argparser = new argparse.ArgumentParser({
	addHelp: true,
	description: 'Generate a static website from an Express application'
});
argparser.addArgument(['--base'], {
	help: 'Set a base URL relative to the domain root. Required with --server=apache.'
});
argparser.addArgument(['--server'], {
	choices: ['apache'],
	help: 'Add control files for serving the application with a particular server'
});
argparser.addArgument(['app'], {
	help: '.js file exporting your Express application'
});
argparser.addArgument(['path'], {
	help: 'Directory to put the built website'
});
var args = argparser.parseArgs();

var app = require(fs.realpathSync(args.app));

var pipe = frozen(app, {
	base: args.base,
	server: args.server
});
pipe.pipe(gulp.dest(args.path));
pipe.on('finish', function(){
	console.log('Done building to', args.path);
});
