// Import libs
import 'jquery';
import 'underscore';
import 'backbone';

import Router from 'router';

import AppView from 'views/AppView';

window.Vibe = window.Vibe || {};

$(function() {
	window.Vibe.appView = new AppView();
	window.Vibe.appView.render();

	Router.init();
});
