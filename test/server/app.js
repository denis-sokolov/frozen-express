'use strict';

var app = require('express')();

app.get('/', function(req, res){
	res.send('Welcome');
});

app.get('/about', function(req, res){
	res.send('About us');
});

module.exports = app;
