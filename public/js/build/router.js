define("router", 
  ["jquery","underscore","backbone","screenRouter","models/survey","models/question","views/homeView","views/welcomeView","views/surveyView","views/surveyDoneView","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __dependency5__, __dependency6__, __dependency7__, __dependency8__, __dependency9__, __dependency10__, __exports__) {
    "use strict";

    var ScreenRouter = __dependency4__["default"];

    var Survey = __dependency5__["default"];
    var Question = __dependency6__["default"];

    var HomeView = __dependency7__["default"];
    var WelcomeView = __dependency8__["default"];
    var SurveyView = __dependency9__["default"];
    var SurveyDoneView = __dependency10__["default"];

    var Router = Backbone.Router.extend({
    	initialize: function() {
    		this.screenRouter = new ScreenRouter();
    		this.screenRouter.initCurrentScreen();
    	},
    	routes: {
    		'': 'index',
    		'/': 'index',
    		'admin': 'admin',
    		'welcome/:step': 'welcome',
    		'discuss/:id': 'discuss',
    		'survey/:tag': 'survey',
    		'surveyDone': 'surveyDone'
    	},
    	index: function() {
    		var that = this,
    			chartsView;

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

    		chartsView = new HomeView();
    		this.screenRouter.currentScreen.html(chartsView.$el);
    		chartsView.render();

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
    	},
    	discuss: function(questionId) {
    		var that = this,
    			qData = window.Vibe.modelCache.getAndRemove('question-' + questionId),
    			question;

    		if (qData) {
    			question = new Question(qData);
    		} else {
    			question = new Question({
    				_id: questionId	
    			});
    			_.defer(question.fetch);
    		}

    		window.Vibe.appView.headerView.setButtons({
    			title: 'vibe',
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

    		this.screenRouter.currentScreen.html(question.get('title'));
    		this.trigger('loaded');
    	},
    	survey: function(surveyId) {
    		var surveyData = window.Vibe.modelCache.getAndRemove('survey-' + surveyId),
    			surveyView,
    			survey;

    		if (surveyData) {
    			survey = new Survey(surveyData);
    		} else {
    			survey = new Survey({
    				id: surveyId
    			});
    			_.defer(survey.fetch);
    		}

    		surveyView = new SurveyView({
    			model: survey	
    		});

    		this.screenRouter.currentScreen.html(surveyView.$el);
    		surveyView.render();

    		this.trigger('loaded');
    	},
    	surveyDone: function() {
    		var surveyDoneView = new SurveyDoneView();

    		window.Vibe.appView.headerView.setButtons({
    			title: '',
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

    		this.screenRouter.currentScreen.html(surveyDoneView.$el);
    		surveyDoneView.render();

    		this.trigger('loaded');
    	}
    });

    _.extend(Router.prototype, {
    	navigateWithAnimation: function(href, animation, opts) {
    		opts = _.extend({
    			waitForLoad: false,
    			screenSize: 'std'
    		}, opts);

    		this.screenRouter.createNewScreen(opts.screenSize);

    		if (opts.waitForLoad) {
    			// TODO: Ajax Loader
    			this.once('loaded', _.bind(function() {
    				this.screenRouter.animateScreens(animation);
    				this.navigate(href, opts);
    				window.Vibe.appView.headerView.animateToNewComponents(animation);
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

    	window.Vibe.appRouter.once('loaded', function() {
    		window.Vibe.appView.headerView.renderCurrentComponents();
    	});

    	Backbone.history.start({
    		pushState: true,
    		root: '/'
    	});
    };

    __exports__["default"] = { init: initRouter };
  });