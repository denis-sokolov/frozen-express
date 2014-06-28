'use strict';

var app = require('express')();

app.get('/', function(req, res){
	res.send('Welcome');
});

app.get('/about', function(req, res){
	res.send('About us');
});

app.use(function(req, res){
	res.status(404);
	res.send('My test 404');
});

module.exports = app;
