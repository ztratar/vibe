// Import libs
import 'jquery';
import 'underscore';
import 'backbone';
import 'faye';
import Router from 'router';
import ScreenRouter from 'screenRouter';
import ModelCache from 'modelCache';
import User from 'models/user';
import AppView from 'views/AppView';
import TutorialHelper from 'helpers/tutorialHelper';

window.Vibe = window.Vibe || {};

window.Vibe.initLive = function() {
	// Initialize Faye for real-time pub sub
	window.Vibe.faye = new Faye.Client(window.fayeServerRoute, {
		timeout: 60,
		retry: 5
	});
};

window.Vibe.run = function() {
	window.Vibe.initLive();

	if (window.isCordova) {
		window.Vibe.faye.disable('websocket');
	}

	// Set up the data cache
	window.Vibe.modelCache = new ModelCache();

	window.Vibe.renderViews = function() {
		// Start the app visuals
		window.Vibe.appView = new AppView();
		window.Vibe.appView.render();

		window.Vibe.appView.run();
	};
	window.Vibe.getAdmins = function() {
		$.ajax({
			type: 'GET',
			url: window.Vibe.serverUrl + 'api/users/admins',
			success: function(data) {
				window.Vibe._data_.admins = data;
			}
		});
	};
	window.Vibe.syncDeviceToken = function() {
		var user = window.Vibe.user;

		/*if (window.Vibe._data_.currentUserDeviceToken
					&& user.get('device_token') !== window.Vibe._data_.currentUserDeviceToken) {*/
			user.save({
				device_token: window.Vibe._data_.currentUserDeviceToken
			});
		//}
	};

	// Load in data, such as user
	if (window.isCordova) {
		window.Vibe.user = new User();

		window.Vibe.user.fetchCurrentUser(function() {
			window.Vibe.getAdmins();
			window.Vibe.renderViews();
			window.Vibe.syncDeviceToken();
			Router.init(true);
		}, function() {
			Router.init(true);
			window.Vibe.appRouter.navigate('/login', true);
		});
	} else {
		window.Vibe.user = new User(window.Vibe._data_.currentUser);
		window.Vibe.renderViews();
		Router.init();

		if (window.Vibe.user.get('email') === 'demo@getvibe.com') {
			TutorialHelper.demoIntro();
		}
	}

	// inits window.Vibe.appRouter
};

window.Vibe.run();
