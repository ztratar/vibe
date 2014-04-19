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

$(function() {
	// Load in data, such as user
	window.Vibe.user = new User({
		name: 'Zach Tratar',
		img: 'https://fbcdn-profile-a.akamaihd.net/hprofile-ak-prn1/t1.0-1/c0.0.160.160/p160x160/1920515_2252277543625_455505174_n.jpg',
		email: 'ztratar@gmail.com',
		company: {
			name: 'Vibe',
			domain: 'vibeapp.org',
			size: 42
		},
		seenTutorial: false
	});

	// Set up the data cache
	window.Vibe.modelCache = new ModelCache();

	// Start the app visuals
	window.Vibe.appView = new AppView();
	window.Vibe.appView.render();

	// inits window.Vibe.appRouter
	Router.init();
});
