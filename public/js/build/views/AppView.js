define("views/AppView", 
  ["backbone","jquery","models/survey","views/headerView","views/notificationsView","text!templates/AppView.html","text!templates/modalOverlay.html","text!templates/surveyNotification.html","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __dependency5__, __dependency6__, __dependency7__, __dependency8__, __exports__) {
    "use strict";
    var Survey = __dependency3__["default"];
    var HeaderView = __dependency4__["default"];
    var NotificationsView = __dependency5__["default"];

    var template = __dependency6__;
    var overlayTemplate = __dependency7__;
    var surveyTemplate = __dependency8__;

    var AppView = Backbone.View.extend({

    	el: 'body',

    	className: 'vibe-app app-view',

    	overlayTemplate: _.template(overlayTemplate),

    	events: {
    		'click .overlay-view-container': 'clickedOverlayBg'
    	},

    	initialize: function() {
    		this.headerView = new HeaderView();
    		this.notificationsView = new NotificationsView();

    		this.overrideLinks();
    	},

    	render: function() {
    		this.$el.html(template);
    		this.$('.app-header').html(this.headerView.$el);

    		this.$overlayContainer = this.$('.overlay-container');
    		this.$overlayContainer.html(this.overlayTemplate());

    		this.$overlayViewContainer = this.$('.overlay-view-container');
    		this.$notifHolder = this.$('.notif-holder');
    		this.$notifText = this.$('.notif-text');

    		this.$notificationsContainer = this.$('.notifications-container');
    	},

    	overrideLinks: function() {
    		this.$el.on('click', 'a', function(ev) {
    			var $target = $(ev.target),
    				href= $target.attr('href'),
    				animation = $target.attr('data-animation');

    			if (!$target.hasClass('no-override') && href && href.charAt(0) === '/') {
    				window.Vibe.appRouter.navigateWithAnimation(href, animation, {
    					trigger: true
    				});
    				return false;
    			}
    		});
    	},

    	showOverlay: function(view, opts) {
    		var that = this;

    		opts = opts || {};

    		if (!view) return;

    		this.$overlayViewContainer.html(view.$el);
    		view.render();

    		_.defer(function() {
    			if (opts.showTopBar) {
    				that.$overlayContainer.addClass('show-top-bar');
    			}

    			that.$overlayContainer.addClass('expand');

    			_.delay(function() {
    				if (opts.afterAnimate && typeof opts.afterAnimate === 'function') {
    					opts.afterAnimate();
    				}
    			}, 200);
    		});

    		view.on('remove', function() {
    			that.closeOverlay();
    		});
    	},

    	closeOverlay: function() {
    		var that = this;

    		this.$overlayContainer.addClass('remove');

    		// Wait for the animation
    		_.delay(function() {
    			that.$overlayContainer.attr('class', 'overlay-container');
    			that.$overlayViewContainer.html('');
    		}, 360);
    	},

    	clickedOverlayBg: function(ev) {
    		var $target = $(ev.target);

    		if ($target.hasClass('overlay-view-container')
    				|| $target.hasClass('close-modal')) {
    			this.closeOverlay();
    		}
    		return false;
    	},

    	openNotifications: function() {
    		this.$notificationsContainer.html(this.notificationsView.$el);
    		this.notificationsView.render();
    		this.$notificationsContainer.addClass('expand');
    		this.headerView.setButtons({
    			title: 'Notifications',
    			leftAction: {
    				icon: '#61943',
    				iconClass: 'x-icon',
    				click: function() {
    					window.Vibe.appView.closeNotifications();
    					return false;
    				}
    			}
    		});
    		this.headerView.animateToNewComponents('fade');
    	},

    	closeNotifications: function() {
    		var that = this;

    		this.$notificationsContainer.removeClass('expand');
    		window.Vibe.appView.headerView.setButtons({
    			title: 'vibe',
    			leftAction: {
    				icon: '#61804',
    				click: function() {
    					window.Vibe.appView.openNotifications();
    					return false;
    				}
    			},
    			rightAction: {
    				title: '',
    				icon: '#61886',
    				click: function() {
    					window.Vibe.appRouter.navigateWithAnimation('settings', 'pushLeft', {
    						trigger: true
    					});
    					return false;
    				}
    			}
    		});
    		this.headerView.animateToNewComponents('fade');
    	},

    	showNotif: function(text, timeToRead, addClass) {
    		var that = this;

    		timeToRead = timeToRead || 2100;
    		addClass = addClass || '';

    		this.$notifText.html(text);

    		this.$notifHolder
    			.addClass('with-anim')
    			.addClass('show-notif');

    		if (addClass) {
    			this.$notifHolder.addClass(addClass);
    		}

    		_.delay(function() {
    			that.$notifHolder.removeClass('with-anim');
    		}, 500);

    		_.delay(function() {
    			that.$notifHolder.removeClass('show-notif');
    			if (addClass) {
    				_.delay(function() {
    					that.$notifHolder.removeClass(addClass);
    				}, 420);
    			}
    		}, timeToRead);
    	}

    });

    __exports__["default"] = AppView;
  });