var env = process.env.NODE_ENV || 'development',
	config = require('../../config/config')[env],
	mongoose = require('mongoose'),
	_ = require('underscore'),
	port = process.env.PORT || 3000,
	express = require('express'),
	app = express();

// Bootstrap db connection
mongoose.connect(config.db);

// Bootstrap models
var models_path = '../models',
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

// express settings
require('../../config/express')(app, config);

var email = require('../controllers/email')(app);

email.all_users_send_unread_notifications();

setTimeout(function() {
	process.exit();
}, 1000 * 60 * 5);
