define("router", 
  ["jquery","underscore","backbone","screenRouter","views/welcomeView","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __dependency5__, __exports__) {
    "use strict";
    var ScreenRouter = __dependency4__["default"];
    var WelcomeView = __dependency5__["default"];

    var Router = Backbone.Router.extend({
    	initialize: function() {
    		this.screenRouter = new ScreenRouter();
    		this.screenRouter.initCurrentScreen();
    	},
    	routes: {
    		'': 'index',
    		'/': 'index',
    		'welcome/:step': 'welcome'
    	},
    	index: function() {
    		// Started tutorial system to test screenRouter
    		if (false && !window.Vibe.user.get('seenTutorial')) {
    			this.navigate('welcome/1', { trigger: true });
    			return;
    		}

    		window.Vibe.appView.headerView.setButtons({
    			title: 'vibe',
    			rightAction: {
    				title: 'Admin',
    				icon: '#61886',
    				animate: 'push-left',
    				click: function(ev) {
    					var $target = $(ev.target);
    					$target.addClass('away');
    				}
    			}	
    		});
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
    	}
    });

    _.extend(Router.prototype, {
    	navigateWithAnimation: function(href, animation, opts) {
    		opts = _.extend({
    			waitForLoad: false	
    		}, opts);

    		if (opts.waitForLoad) {
    			// TODO: Ajax Loader
    			this.screenRouter.createNewScreen(animation, function() {
    				this.navigate(href, opts);
    			});
    		} else {
    			this.screenRouter.createNewScreen(animation);
    			this.navigate(href, opts);
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

    __exports__["default"] = { init: initRouter };
  });