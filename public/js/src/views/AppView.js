import 'backbone';
import 'jquery';

import Notifications from 'models/notifications';
import HeaderView from 'views/headerView';
import NotificationsView from 'views/notificationsView';
import TutorialHelper from 'helpers/tutorialHelper';
import Analytics from 'helpers/analytics';

module template from 'text!templates/AppView.html';
module overlayTemplate from 'text!templates/modalOverlay.html';
module surveyTemplate from 'text!templates/surveyNotification.html';

var AppView = Backbone.View.extend({

	el: '#vibe-app',

	className: 'vibe-app app-view',

	overlayTemplate: _.template(overlayTemplate),

	events: {
		'click .overlay-view-container': 'clickedOverlayBg'
	},

	initialize: function() {
		var that = this;

		this.origPageTitle = document.title;

		this.notifications = new Notifications();
		this.notifications.url = window.Vibe.serverUrl + 'api/notifications';

		this.headerView = new HeaderView();
		this.notificationsView = new NotificationsView({
			notifications: this.notifications
		});

		this.notificationsView.notifications.on('add reset sort fake-add', function() {
			that.changeUnreadNotificationsNum();
		});

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

		this.$notificationsContainer.html(this.notificationsView.$el);
		this.notificationsView.render();

		this.changeUnreadNotificationsNum();
	},

	changeUnreadNotificationsNum: function() {
		var numUnread = this.notificationsView.notifications.unread().length;
		this.headerView.changeUnreadNum(numUnread);
		document.title = (numUnread > 0 ? '(' + numUnread + ') ' : '') + this.origPageTitle;
	},

	run: function() {
		var that = this;

		this.notifications.fetch({
			reset: true
		});
		window.Vibe.faye.subscribe('/api/users/' + window.Vibe.user.get('_id') + '/notifications', function(data) {
			that.notifications.add(data, {
				merge: true
			});
			that.notifications.trigger('fake-add');
		});

		_.delay(function() {
			TutorialHelper.firstTimeUser();
		}, 400);
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

		if (this.closeOverlayTimeout) {
			this.$overlayContainer.removeClass('remove');
			clearTimeout(this.closeOverlayTimeout);
		}

		this.overlayedView = view;

		this.$overlayViewContainer.html(view.$el);
		view.render();

		if (opts.noAnimation) {
			this.$overlayContainer.hide()
		}

		_.defer(function() {
			if (opts.showTopBar) {
				that.$overlayContainer.addClass('show-top-bar');
			}

			if (opts.noAnimation) {
				that.$overlayContainer.show()
			}

			that.$overlayContainer.addClass('expand');

			if (opts.afterRender && typeof opts.afterRender === 'function') {
				_.delay(function() {
					opts.afterRender();
				}, 5);
			}

			_.delay(function() {
				if (opts.afterAnimate && typeof opts.afterAnimate === 'function') {
					opts.afterAnimate();
				}
			}, 200);
		});

		view.on('remove', function() {
			that.closeOverlay();

			if (opts.onRemove) {
				opts.onRemove();
			}
		});
	},

	startCloseOverlay: function() {
		if (this.overlayedView) {
			this.overlayedView.remove();
		}
	},

	closeOverlay: function() {
		var that = this;

		this.$overlayContainer.addClass('remove');

		// Wait for the animation
		this.closeOverlayTimeout = setTimeout(function() {
			if (that.overlayedView) {
				that.overlayedView.trigger('remove-done');
			}
			delete that.overlayedView;
			that.$overlayContainer.attr('class', 'overlay-container');
			that.$overlayViewContainer.html('');
		}, 360);
	},

	clickedOverlayBg: function(ev) {
		var $target = $(ev.target);

		if (window.Vibe.draggingScreen) {
			return false;
		}

		if ($target.hasClass('overlay-view-container')
				|| $target.hasClass('close-modal')) {
			this.startCloseOverlay();
		}
		return false;
	},

	openNotifications: function() {
		this.notifications.markAllRead();
		this.$notificationsContainer.addClass('expand');

		if (window.isCordova) {
			window.Vibe.appRouter.screenRouter.currentScreen.hide();
		}

		this.headerView.setButtons({
			title: 'Notifications',
			leftAction: {
				icon: '#61943',
				iconClass: 'x-icon',
				click: function() {
					window.Vibe.appRouter.navigate('/');
					window.Vibe.appView.closeNotifications();
					return false;
				}
			}
		});
		this.headerView.animateToNewComponents('fade');
		this.changeUnreadNotificationsNum();

		Analytics.log({
			'eventCategory': 'notifications',
			'eventAction': 'opened',
			'eventLabel': 'Unread - ' + this.notificationsView.notifications.unread().length
		});
	},

	closeNotifications: function() {
		var that = this;

		this.$notificationsContainer.removeClass('expand');
		window.Vibe.appView.headerView.setHomeButtons();

		if (window.isCordova) {
			window.Vibe.appRouter.screenRouter.currentScreen.show();
		}

		this.headerView.animateToNewComponents('fade');

		Analytics.log({
			'eventCategory': 'notifications',
			'eventAction': 'closed'
		});
	},

	showNotif: function(text, opts) {
		opts = opts || {};

		var that = this,
			timeToRead = opts.timeToRead || 2100,
			addClass = opts.addClass || '',
			type = opts.type || 'center';

		if (this.notifShowTimeout) clearTimeout(this.notifShowTimeout);
		if (this.notifHideTimeout) clearTimeout(this.notifHideTimeout);

		this.$notifHolder.attr('class', 'notif-holder now ' + type);
		_.delay(function() {
			that.$notifHolder.removeClass('now');
		}, 5);
		if (addClass) {
			this.$notifHolder.addClass(addClass);
		}
		this.$notifText.html(text);

		this.notifShowTimeout = setTimeout(function() {
			that.$notifHolder
				.addClass('with-anim')
				.addClass('show-notif');
		}, 140);

		_.delay(function() {
			that.$notifHolder.removeClass('with-anim');
		}, 500);

		this.notifHideTimeout = setTimeout(function() {
			that.$notifHolder.removeClass('show-notif');
			that.notifHideTimeout = setTimeout(function() {
				that.$notifHolder.removeClass(type);
				if (addClass) {
					that.$notifHolder.removeClass(addClass);
				}
			}, 420);
		}, timeToRead);
	},

	disableScroll: function() {
		$('body').on('touchmove.disScroll scroll.disScroll', function(ev) {
			ev.preventDefault();
			ev.stopPropagation();
			return false;
		});
	},

	enableScroll: function() {
		$('body').off('touchmove.disScroll scroll.disScroll');
	}

});

export default = AppView;
