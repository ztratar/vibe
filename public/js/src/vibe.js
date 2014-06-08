// Import libs
import 'jquery';
import 'underscore';
import 'backbone';
import Router from 'router';
import ScreenRouter from 'screenRouter';
import ModelCache from 'modelCache';
import User from 'models/user';
import AppView from 'views/AppView';

window.Vibe = window.Vibe || {};

window.Vibe.run = function() {
	// Load in data, such as user
	window.Vibe.user = new User(window.Vibe._data_.currentUser);

	// Set up the data cache
	window.Vibe.modelCache = new ModelCache();

	// Start the app visuals
	window.Vibe.appView = new AppView();
	window.Vibe.appView.render();

	// inits window.Vibe.appRouter
	Router.init();
};

window.Vibe.run();
