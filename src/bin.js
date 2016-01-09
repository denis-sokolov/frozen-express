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
argparser.addArgument(['app'], {
	help: '.js file exporting your Express application'
});
argparser.addArgument(['path'], {
	help: 'Directory to put the built website'
});
var args = argparser.parseArgs();

var app = require(fs.realpathSync(args.app));

var pipe = frozen(app, {
	base: args.base
});
pipe.pipe(gulp.dest(args.path));
pipe.on('finish', function(){
	console.log('Done building to', args.path);
});
