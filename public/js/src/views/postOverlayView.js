import 'backbone';
import 'autosize';
import BaseView from 'views/baseView';
import Users from 'models/users';
import Feedback from 'models/feedback';
import Analytics from 'helpers/analytics';

module template from 'text!templates/postOverlayView.html';

var PostOverlayView = BaseView.extend({

	className: 'post-overlay-view',

	template: _.template(template),

	MAX_TEXT_LENGTH: 140,

	events: {
		'keydown textarea': 'changeLengthMarker',
		'keyup textarea': 'changeLengthMarker',
		'click .v-centered': 'clickedModal'
	},

	render: function() {
		var that = this,
			adminNames;

		this.admins = new Users(window.Vibe._data_.admins);
		adminNames = this.admins.getNames();

		window.Vibe.appRouter.screenRouter.disableScreenScroll();

		if (window.isCordova) {
			window.Vibe.appView.disableScroll();
		}

		setTimeout(function() {
			window.Vibe.appView.headerView.setButtons({
				title: '',
				rightAction: {
					title: 'Post',
					click: function(ev) {
						that.submitNewFeedback();
						return false;
					}
				},
				leftAction: {
					title: 'Cancel',
					click: function(ev) {
						Analytics.log({
							eventCategory: 'post',
							eventAction: 'canceled'
						});

						that.remove();
						return false;
					}
				}
			});
			window.Vibe.appView.headerView.animateToNewComponents('slideDown');
		}, 200);

		this.$el.html(this.template({
			maxTextLength: this.MAX_TEXT_LENGTH,
			adminNames: adminNames,
			adminAvatar: this.admins.first().getAvatar()
		}));

		this.$textarea = this.$('textarea');
		this.$lengthMarker = this.$('.length-marker');

		this.$textarea.autosize();

		if (window.isCordova) {
			this.$textarea.focus();
		}

		$(window)
			.off('resize.postOverlay')
			.on('resize.postOverlay', _.bind(function() {
				this.$textarea.autosize();
				this.positionModal();
			}, this));

		return this;
	},

	positionModal: function() {
		var offset;

		if ($('.overlay-container').hasClass('expand')) {
			console.log('has expand!');
			var screenHeight = this.$el.height(),
				windowHeight = screenHeight + 64,
				postHeight = 500;

			if (windowHeight < 570) {
				postHeight = 360;
			} else if (windowHeight < 650) {
				postHeight = 440;
			}

			offset = Math.round((screenHeight - postHeight)/2);
		} else {
			console.log('no has expand!');
			offset = 122;
		}

		this.$container = this.$container || this.$('.container');
		this.$container.css('transform', 'translate3d(0, '+offset+'px, 0)');
		this.$container.css('-webkit-transform', 'translate3d(0, '+offset+'px, 0)');
	},

	changeLengthMarker: function(ev) {
		var inputVal = this.$textarea.val(),
			markerText = inputVal.length + '/' + this.MAX_TEXT_LENGTH;

		if (ev.keyCode === 91 || ev.keyCode === 17) {
			if (ev.type === 'keydown') {
				this.ctrlCommandDown = true;
			} else if (ev.type === 'keyup') {
				this.ctrlCommandDown = false;
			}
		}

		if (ev.keyCode === 65 && this.ctrlCommandDown) {
			return true;
		}

		if ((inputVal.length > this.MAX_TEXT_LENGTH
				&& ev.keyCode !== 8)
				|| ev.keyCode === 13) {
			return false;
		}

		this.$lengthMarker.html(markerText);
	},

	// Textarea is only spans the actual text, but
	// clicking the entire modal should focus the textarea
	clickedModal: function(ev) {
		if ($(ev.target).hasClass('input-center')) {
			this.$textarea.focus();
			return false;
		}
	},

	submitNewFeedback: function() {
		var that = this,
			inputVal = this.$textarea.val(),
			feedback = new Feedback();

		if (!inputVal.length) {
			window.Vibe.appView.showNotif('Feedback can\'t be blank', 2000, 'danger');
			return false;
		}

		Analytics.log({
			eventCategory: 'post',
			eventAction: 'submitted'
		});

		feedback.save({
			body: inputVal
		}, {
			success: function(model, data) {
				if (data.error) {
					Analytics.log({
						eventCategory: 'post',
						eventAction: 'submission-error',
						eventLabel: data.error
					});

					window.Vibe.appView.showNotif(data.error, 2000, 'danger');
					return;
				}

				Analytics.log({
					eventCategory: 'post',
					eventAction: 'submission-success'
				});

				window.Vibe.appView.showNotif('Feedback sent!');
				that.remove();
			}
		});
	},

	remove: function() {
		window.Vibe.appRouter.screenRouter.enableScreenScroll();

		if (window.isCordova) {
			window.Vibe.appView.enableScroll();
		}

		window.Vibe.appView.headerView.setHomeButtons();
		window.Vibe.appView.headerView.animateToNewComponents('slideDown');

		this.trigger('remove');
		this.$el.addClass('remove');
		_.delay(_.bind(function() {
			this.$el.remove();
		}, this), 280);
	}

});

export default = PostOverlayView;
