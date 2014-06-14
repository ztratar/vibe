import 'backbone';
import 'jquery';
import Survey from 'models/survey';
import HeaderView from 'views/headerView';

module template from 'text!templates/AppView.html';
module overlayTemplate from 'text!templates/modalOverlay.html';
module surveyTemplate from 'text!templates/surveyNotification.html';

var AppView = Backbone.View.extend({

	el: 'body',

	className: 'vibe-app app-view',

	overlayTemplate: _.template(overlayTemplate),

	events: {
		'click .overlay-view-container': 'clickedOverlayBg'
	},

	initialize: function() {
		this.headerView = new HeaderView();
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

export default = AppView;
