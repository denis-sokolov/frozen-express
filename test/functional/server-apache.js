'use strict';

var frozen = require('../..');
var util = require('./lib/util.js');

var test = util.test(frozen);

util.it('should complain about unset base', function(express, done){
	test(express, done)
		.rethrow()
		.results({
			server: 'apache'
		})
		.then(function(){
			done(new Error('Should have failed'));
		})
		.catch(function(err) {
			if (err instanceof frozen.errors.ConfigurationError) done();
			else done(err);
		});
});

util.it('should create an .htaccess file when asked for', function(express, done){
	test(express, done)
		.route('/', 'index.html', 'Hello!')
		.run({
			base: '/',
			checkFiles: [{path:'.htaccess'}],
			server: 'apache'
		});
});

util.it('should create an .htaccess file even if no routes', function(express, done){
	test(express, done)
		.run({
			base: '/',
			checkFiles: [{path:'.htaccess'}],
			server: 'apache'
		});
});

util.it('should create a 404 file even if no routes', function(express, done){
	test(express, done)
		.on404('error here')
		.run({
			base: '/',
			checkFiles: [{path:'.frozen_express_404.html', contents:'error here'}],
			server: 'apache'
		});
});

util.it('should add the base url to .htaccess', function(express, done){
	test(express, done)
		.run({
			base: '/THE_TEST_BASE/',
			checkFiles: [{path:'.htaccess', contents:/THE_TEST_BASE/}],
			server: 'apache'
		});
});

util.it('should allow extra .htaccess rules', function(express, done){
	test(express, done)
		.run({
			apache: {
				extraHtaccess: 'CUSTOM_CONTENTS'
			},
			base: '/',
			checkFiles: [{path:'.htaccess', contents:/\nCUSTOM_CONTENTS\n/}],
			server: 'apache'
		});
});
