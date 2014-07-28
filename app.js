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
console.log('-----');
console.log('Attempting to create Mongoose connection...');
var mongooseConnection = mongoose.connect(config.mongoosedb, {
		server: {
			socketOptions: {
				keepAlive: 1
			}
		},
		replset: {
			socketOptions: {
				keepAlive: 1
			}
		}
	}, function(e) {
		console.log('Mongoose connection created!');
		console.log('-----');

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

		console.log('Setting up express & http...');
		app = express();
		var server = http.createServer(app);

		// express settings
		require('./config/express')(app, config, passport, mongooseConnection);

		// Bootstrap routes
		require('./config/routes')(app, passport);

		// Start faye
		require('./app/live')(server);

		// Start the app by listening on <port>
		server.listen(port);
		console.log('Express app started on port ' + port);
	});

// expose app
exports = module.exports = app;
