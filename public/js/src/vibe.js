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
import LoginView from 'views/loginView';
import TutorialHelper from 'helpers/tutorialHelper';

window.Vibe = window.Vibe || {};

window.Vibe.run = function() {
	// Initialize Faye for real-time pub sub
	window.Vibe.faye = new Faye.Client(window.fayeServerRoute);

	// Set up the data cache
	window.Vibe.modelCache = new ModelCache();

	var renderViews = function() {
			// Start the app visuals
			window.Vibe.appView = new AppView();
			window.Vibe.appView.render();

			window.Vibe.appView.run();

			// inits window.Vibe.appRouter
			Router.init();
		},
		getAdmins = function() {
			$.ajax({
				type: 'GET',
				url: window.Vibe.serverUrl + 'api/users/admins',
				success: function(data) {
					window.Vibe._data_.admins = data;
				}
			});
		};

	// Load in data, such as user
	if (window.isCordova) {
		window.Vibe.user = new User();

		window.Vibe.user.fetchCurrentUser(function() {
			getAdmins();
			renderViews();
		}, function() {
			var loginView = new LoginView({
				loginCallback: function() {
					window.Vibe.user.fetchCurrentUser(function() {
						getAdmins();
						renderViews();
					});
				}
			});
			$('#vibe-app').html(loginView.$el);
			loginView.render();
		});
	} else {
		window.Vibe.user = new User(window.Vibe._data_.currentUser);
		renderViews();

		if (window.Vibe.user.get('email') === 'demo@getvibe.com') {
			TutorialHelper.demoIntro();
		}
	}
};

window.Vibe.run();
