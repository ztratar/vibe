/**
 * Module dependencies.
 */
var express = require('express'),
	fs = require('fs'),
	passport = require('passport'),
	_ = require('underscore'),
	live = require('./app/live');

// Load configurations
// if test env, load example file
var env = process.env.NODE_ENV || 'development',
	config = require('./config/config')[env],
	mongoose = require('mongoose');

// Bootstrap db connection
mongoose.connect(config.db);

// Bootstrap models
var models_path = __dirname + '/app/models',
	models = [
		'accessRequest',
		'answer',
		'chat',
		'company',
		'feedback',
		'metaquestion',
		'notification',
		'questionInstance',
		'question',
		'post',
		'user',
		'userInvite'
	];

_.each(models, function(modelName) {
	require(models_path + '/' + modelName);
});

// bootstrap passport config
require('./config/passport')(passport, config);

var app = express();
// express settings
require('./config/express')(app, config, passport);

// Bootstrap routes
require('./config/routes')(app, passport);

// Start the app by listening on <port>
var port = process.env.PORT || 3000;
app.listen(port);
console.log('Express app started on port ' + port);

// expose app
exports = module.exports = app;
