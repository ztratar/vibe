/**
 * Module dependencies.
 */

var express = require('express'),
	MongoStore = require('connect-mongostore')(express),
	helpers = require('../app/helpers'),
	swig = require('swig');

// CSRF Tokens
var csrfValue = function(req) {
	var token = (req.body && req.body._csrf)
		|| (req.query && req.query._csrf)
		|| (req.cookies['x-csrf-token'])
		|| (req.cookies['x-xsrf-token']);

	console.log('token found', token);

	return token;
};

module.exports = function (app, config, passport, mongooseConnection, afterMongoConnect) {
	app.set('showStackError', true);
	// should be placed before express.static
	app.use(express.compress({
		filter: function (req, res) {
			return /json|text|javascript|css/.test(res.getHeader('Content-Type'));
		},
		level: 9
	}));
	// app.use(express.favicon());
	app.use(express.static(config.root + '/public'));

	// don't use logger for test env
	if (process.env.NODE_ENV !== 'test') {
		app.use(express.logger('dev'));
	}

	// set views path, template engine and default layout
	app.engine('html', swig.renderFile);
	app.set('view engine', 'html');
	app.set('views', config.root + '/app/views');
	app.set('view cache', process.env.NODE_ENV !== 'development');

	app.configure(function () {

		// cookieParser should be above session
		app.use(express.cookieParser());

		// bodyParser should be above methodOverride
		app.use(express.bodyParser());
		app.use(express.methodOverride());

		app.use(function(req, res, next) {
			res.header('Access-Control-Allow-Origin', 'https://www.getvibe.com');
			res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
			res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

			if (req.method === 'OPTIONS') {
				return res.send(200);
			}

			next();
		});

		// express/mongo session storage
		app.use(express.session({
			secret: 'noobjs',
			store: new MongoStore({
				mongooseConnection: mongooseConnection.connections[0],
				collection : 'sessions'
			}, function() {
				afterMongoConnect();
			})
		}));

		app.use(function (req, res, next) {
			res.locals.session = req.session;
			next();
		});

		// use passport session
		if (passport) {
			app.use(passport.initialize());
			app.use(passport.session());
		}

		app.use(express.csrf({
			value: csrfValue
		}));
		app.use(function(req, res, next) {
			var newToken = req.csrfToken();
			res.cookie('x-csrf-token', newToken);
			res.locals.token = newToken;
			next();
		});

		app.use(helpers.adminUserOverride);

		// routes should be at the last
		app.use(app.router);

		// assume "not found" in the error msgs
		// is a 404. this is somewhat silly, but
		// valid, you can do whatever you like, set
		// properties, use instanceof etc.
		app.use(function(err, req, res, next){
			// treat as 404
			if (err.message && ~err.message.indexOf('not found')) return next()

			// log it
			console.log('Express error', err)

			res.send(err.status || 500, { error: err.message })
		});

		// assume 404 since no middleware responded
		app.use(function(req, res, next){
			res.status(404).render('404', { url: req.originalUrl, error: 'Not found' })
		});

	})
}
