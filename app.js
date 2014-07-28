/**
 * Module dependencies.
 */
var http = require('http'),
	express = require('express'),
	fs = require('fs'),
	passport = require('passport'),
	_ = require('underscore');

// Load configurations
// if test env, load example file
var env = process.env.NODE_ENV || 'development',
	config = require('./config/config')[env],
	mongoose = require('mongoose'),
	port = process.env.PORT || 3000,
	app;

// Bootstrap db connection
mongoose.connect(config.mongoosedb, function(e) {
	console.log('connected info', e);

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

	app = express();
	var server = http.createServer(app);

	// express settings
	require('./config/express')(app, config, passport, function() {
		// Bootstrap routes
		require('./config/routes')(app, passport);

		// Start faye
		require('./app/live')(server);

		// Start the app by listening on <port>
		server.listen(port);
		console.log('Express app started on port ' + port);
	});
});

// expose app
exports = module.exports = app;
