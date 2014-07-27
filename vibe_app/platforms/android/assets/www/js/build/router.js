define("router", 
  ["jquery","underscore","backbone","screenRouter","models/question","models/feedback","views/homeView","views/welcomeView","views/settingsView","views/settingsEditFieldView","views/manageTeamView","views/managePollsView","views/postChatView","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __dependency5__, __dependency6__, __dependency7__, __dependency8__, __dependency9__, __dependency10__, __dependency11__, __dependency12__, __dependency13__, __exports__) {
    "use strict";

    var ScreenRouter = __dependency4__["default"];

    var Question = __dependency5__["default"];
    var Feedback = __dependency6__["default"];

    var HomeView = __dependency7__["default"];
    var WelcomeView = __dependency8__["default"];

    var SettingsView = __dependency9__["default"];
    var SettingsEditFieldView = __dependency10__["default"];
    var ManageTeamView = __dependency11__["default"];
    var ManagePollsView = __dependency12__["default"];
    var PostChatView = __dependency13__["default"];

    var Router = Backbone.Router.extend({

    	initialize: function() {
    		this.screenRouter = new ScreenRouter();
    		this.screenRouter.initCurrentScreen();
    	},

    	routes: {
    		'index.html': 'index',
    		'': 'index',
    		'/': 'index',
    		'notifications': 'notifications',
    		'settings': 'settings',
    		'settings/name': 'settingsName',
    		'settings/email': 'settingsEmail',
    		'settings/password': 'settingsPassword',
    		'settings/admin/team': 'manageTeam',
    		'settings/admin/polls': 'managePolls',
    		'welcome/:step': 'welcome',
    		'question/:id': 'question',
    		'feedback/:id': 'feedback',
    		'question/:id/chat': 'question',
    		'feedback/:id/chat': 'feedback'
    	},

    	index: function() {
    		var that = this;

    		window.Vibe.appView.startCloseOverlay();

    		// Started tutorial system to test screenRouter
    		if (false && !window.Vibe.user.get('seenTutorial')) {
    			this.navigate('welcome/1', { trigger: true });
    			return;
    		}

    		window.Vibe.appView.headerView.setHomeButtons();
    		this.homeView = new HomeView();

    		this.screenRouter.currentScreenContainer.html(this.homeView.$el);

    		this.homeView.render();

    		this.homeView.posts.url = window.Vibe.serverUrl + 'api/posts';
    		this.homeView.posts.fetch();

    		window.Vibe.faye.subscribe('/api/users/' + window.Vibe.user.get('_id') + '/posts', function(newPost) {
    			that.homeView.posts.addCached(newPost);
    		});

    		this.trigger('loaded');
    	},

    	welcome: function(step) {
    		var welcomeView = new WelcomeView();

    		this.screenRouter.currentScreen.addClass('full');
    		this.screenRouter.currentScreenContainer.html(welcomeView.$el);
    		welcomeView.render();

    		if (step === '2') {
    			welcomeView.$el.html('test');
    		}

    		this.trigger('loaded');
    	},

    	notifications: function() {
    		this.index();
    		window.Vibe.appView.openNotifications();
    	},

    	settings: function() {
    		var that = this,
    			settingsView = new SettingsView({
    				user: window.Vibe.user
    			});

    		window.Vibe.appView.headerView.setButtons({
    			title: 'settings',
    			leftAction: {
    				icon: '#61903',
    				title: '',
    				click: function(ev) {
    					that.navigateWithAnimation('/', 'pushRight', {
    						trigger: true
    					});
    					return false;
    				}
    			}
    		});

    		this.screenRouter.currentScreenContainer.html(settingsView.$el);
    		settingsView.render();

    		this.trigger('loaded');
    	},

    	settingsName: function() {
    		var that = this,
    			settingsEditFieldView = new SettingsEditFieldView({
    				title: 'Name',
    				model: window.Vibe.user,
    				attributeName: 'name',
    				placeholder: 'Full Name',
    				confirm: false,
    				helperText: 'Please enter your full name. Your identity is only visible in chat.'
    			});

    		window.Vibe.appView.headerView.setHomeButtons();

    		this.screenRouter.currentScreenContainer.html(settingsEditFieldView.$el);
    		settingsEditFieldView.render();

    		this.trigger('loaded');
    	},

    	settingsEmail: function() {
    		var that = this,
    			settingsEditFieldView = new SettingsEditFieldView({
    				title: 'Email',
    				model: window.Vibe.user,
    				attributeName: 'email',
    				placeholder: 'Ex: your@email.com',
    				confirm: false,
    				helperText: 'After clicking save, we will send you a confirmation email to complete the change.'
    			});

    		window.Vibe.appView.headerView.setButtons({
    			title: 'Email',
    			leftAction: {
    				icon: '',
    				title: 'Cancel',
    				click: function(ev) {
    					that.navigateWithAnimation('/settings', 'pushRight', {
    						trigger: true
    					});
    					return false;
    				}
    			},
    			rightAction: {
    				title: 'Save',
    				click: function() {
    					settingsEditFieldView.saveField();
    					return false;
    				}
    			}
    		});

    		this.screenRouter.currentScreenContainer.html(settingsEditFieldView.$el);
    		settingsEditFieldView.render();

    		this.trigger('loaded');
    	},

    	settingsPassword: function() {
    		var that = this,
    			settingsEditFieldView = new SettingsEditFieldView({
    				title: 'Password',
    				model: window.Vibe.user,
    				attributeName: 'password',
    				placeholder: 'Make it great!',
    				confirm: true,
    				askForCurrent: true,
    				fieldType: 'password',
    				helperText: 'After clicking save, we will send you a confirmation email to complete the change.'
    			});

    		window.Vibe.appView.headerView.setButtons({
    			title: 'Password',
    			leftAction: {
    				icon: '',
    				title: 'Cancel',
    				click: function(ev) {
    					that.navigateWithAnimation('/settings', 'pushRight', {
    						trigger: true
    					});
    					return false;
    				}
    			},
    			rightAction: {
    				title: 'Save',
    				click: function() {
    					settingsEditFieldView.saveField();
    					return false;
    				}
    			}
    		});

    		this.screenRouter.currentScreenContainer.html(settingsEditFieldView.$el);
    		settingsEditFieldView.render();

    		this.trigger('loaded');
    	},

    	manageTeam: function() {
    		var that = this,
    			manageTeamView = new ManageTeamView();

    		window.Vibe.appView.headerView.setButtons({
    			title: 'Team',
    			leftAction: {
    				icon: '#61903',
    				title: '',
    				click: function(ev) {
    					that.navigateWithAnimation('/settings', 'pushRight', {
    						trigger: true
    					});
    					return false;
    				}
    			}
    		});

    		this.screenRouter.currentScreenContainer.html(manageTeamView.$el);
    		manageTeamView.render();

    		this.trigger('loaded');
    	},

    	managePolls: function() {
    		var that = this,
    			managePollsView = new ManagePollsView();

    		window.Vibe.appView.headerView.setButtons({
    			title: 'Polls',
    			leftAction: {
    				icon: '#61903',
    				title: '',
    				click: function(ev) {
    					that.navigateWithAnimation('/settings', 'pushRight', {
    						trigger: true
    					});
    					return false;
    				}
    			}
    		});

    		this.screenRouter.currentScreenContainer.html(managePollsView.$el);
    		managePollsView.render();

    		this.trigger('loaded');
    	},

    	question: function(questionId) {
    		var that = this,
    			qData = window.Vibe.modelCache.getAndRemove('question-' + questionId),
    			question,
    			postChatView,
    			closeUrl = this.getCachedBackUrl();

    		if (qData) {
    			question = new Question(qData);
    		} else {
    			question = new Question({
    				_id: questionId
    			});
    			_.defer(function() {
    				question.fetch();
    			});
    		}

    		postChatView = new PostChatView({
    			question: question,
    			closeUrl: closeUrl || '',
    			forceChatPosition: (window.Backbone.history.fragment.indexOf('/chat') !== -1)
    		});
    		window.Vibe.appView.showOverlay(postChatView);
    	},

    	feedback: function(feedbackId) {
    		var that = this,
    			qData = window.Vibe.modelCache.getAndRemove('feedback-' + feedbackId),
    			feedback,
    			postChatView,
    			closeUrl = this.getCachedBackUrl();

    		if (qData) {
    			feedback = new Feedback(qData);
    		} else {
    			feedback = new Feedback({
    				_id: feedbackId
    			});
    			_.defer(function() {
    				feedback.fetch();
    			});
    		}

    		postChatView = new PostChatView({
    			feedback: feedback,
    			closeUrl: closeUrl || '',
    			forceChatPosition: (window.Backbone.history.fragment.indexOf('/chat') !== -1)
    		});
    		window.Vibe.appView.showOverlay(postChatView);
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
    				window.Vibe.appView.headerView.animateToNewComponents(animation);
    			}, this));
    			this.navigate(href, opts);
    		} else {
    			this.screenRouter.animateScreens(animation);
    			this.navigate(href, opts);
    			window.Vibe.appView.headerView.animateToNewComponents(animation);
    		}
    	},

    	getCachedBackUrl: function() {
    		if (window.Vibe.cachedBackUrl) {
    			var holdUrl = window.Vibe.cachedBackUrl;
    			window.Vibe.cachedBackUrl = false;
    			return holdUrl;
    		} else {
    			return false;
    		}
    	}

    });

    var initRouter = function() {
    	window.Vibe.appRouter = new Router();

    	window.Vibe.appRouter.once('loaded', function() {
    		window.Vibe.appView.headerView.renderCurrentComponents();
    	});

    	window.Vibe.appRouter.index();

    	Backbone.history.start({
    		pushState: true,
    		root: '/'
    	});
    };

    __exports__["default"] = { init: initRouter };
  });