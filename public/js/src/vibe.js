// Import libs
import 'jquery';
import 'underscore';
import 'backbone';
import Router from 'router';
import ScreenRouter from 'screenRouter';
import User from 'models/user';
import AppView from 'views/AppView';

window.Vibe = window.Vibe || {};

$(function() {
	// Load in data, such as user
	window.Vibe.user = new User({
		name: 'Zach Tratar',
		email: 'ztratar@gmail.com',
		company: {
			name: 'Y Combinator',
			domain: 'ycombinator.com',
			size: 42
		},
		seenTutorial: false
	});

	// Start the app visuals
	window.Vibe.appView = new AppView();
	window.Vibe.appView.render();

	// inits window.Vibe.appRouter
	Router.init();
});
