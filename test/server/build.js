'use strict';

var argparse = require('argparse');
var gulp = require('gulp');

var app = require('./app.js');
var frozen = require('../..');

var argparser = new argparse.ArgumentParser({
	addHelp: true,
	description: 'Generate a website for server configuration testing'
});
argparser.addArgument(['path'], {
	help: 'Directory to put the built website'
});
argparser.addArgument(['--htaccess'], {
	action: 'storeTrue',
	help: 'Include .htaccess file in the build'
});
var args = argparser.parseArgs();

var pipe = frozen(app, {
	htaccess: args.htaccess
});
pipe.pipe(gulp.dest(args.path));
pipe.on('finish', function(){
	console.log('Done building to', args.path);
});
