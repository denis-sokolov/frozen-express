'use strict';

var argparse = require('argparse');
var gulp = require('gulp');

var app = require('./app.js');
var frozen = require('../..');

var argparser = new argparse.ArgumentParser({
	addHelp: true,
	description: 'Generate a website for server configuration testing'
});
argparser.addArgument(['server'], {
	choices: ['apache'],
	help: 'Server name to build for'
});
argparser.addArgument(['path'], {
	help: 'Directory to put the built website'
});
var args = argparser.parseArgs();

var pipe = frozen(app, {
	server: args.server
});
pipe.pipe(gulp.dest(args.path));
pipe.on('finish', function(){
	console.log('Done building to', args.path);
});
