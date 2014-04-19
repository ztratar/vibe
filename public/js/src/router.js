import 'jquery';
import 'underscore';
import 'backbone';
import ScreenRouter from 'screenRouter';
import WelcomeView from 'views/welcomeView';

var Router = Backbone.Router.extend({
	initialize: function() {
		this.screenRouter = new ScreenRouter();
		this.screenRouter.initCurrentScreen();
	},
	routes: {
		'': 'index',
		'/': 'index',
		'welcome/:step': 'welcome',
		'admin': 'admin'
	},
	index: function() {
		var that = this;

		// Started tutorial system to test screenRouter
		if (false && !window.Vibe.user.get('seenTutorial')) {
			this.navigate('welcome/1', { trigger: true });
			return;
		}

		window.Vibe.appView.headerView.setButtons({
			title: 'vibe',
			rightAction: {
				title: 'admin',
				icon: '#61886',
				click: function(ev) {
					var $target = $(ev.target);
					that.navigateWithAnimation('admin', 'pushLeft', {
						trigger: true
					});	
					return false;
				}
			}	
		});
		this.screenRouter.currentScreen.html('home');
		this.trigger('loaded');
	},
	welcome: function(step) {
		var welcomeView = new WelcomeView();

		this.screenRouter.currentScreen.addClass('full');
		this.screenRouter.currentScreen.html(welcomeView.$el);
		welcomeView.render();

		if (step === '2') {
			welcomeView.$el.html('test');
		}

		this.trigger('loaded');
	},
	admin: function() {
		var that = this;

		window.Vibe.appView.headerView.setButtons({
			title: 'admin',
			leftAction: {
				icon: '#61903',
				title: 'vibe',
				click: function(ev) {
					that.navigateWithAnimation('/', 'pushRight', {
						trigger: true
					});	
					return false;
				}
			}	
		});

		this.screenRouter.currentScreen.html('admin');
		this.trigger('loaded');
	}
});

_.extend(Router.prototype, {
	navigateWithAnimation: function(href, animation, opts) {
		opts = _.extend({
			waitForLoad: false	
		}, opts);

		this.screenRouter.createNewScreen();

		if (opts.waitForLoad) {
			// TODO: Ajax Loader
			this.once('loaded', _.bind(function() {
				this.screenRouter.animateScreens(animation);
				window.Vibe.appView.headerView.animateToNewComponents(animation);
				this.navigate(href, opts);
			}, this));
		} else {
			this.screenRouter.animateScreens(animation);
			this.navigate(href, opts);
			window.Vibe.appView.headerView.animateToNewComponents(animation);
		}
	}
});

var initRouter = function() {
	window.Vibe.appRouter = new Router();

	Backbone.history.start({
		pushState: true,
		root: '/'
	});
};

export default = { init: initRouter };
