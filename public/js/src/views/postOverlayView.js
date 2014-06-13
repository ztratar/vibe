import 'backbone';
import 'autosize';

import Feedback from 'models/feedback';

module template from 'text!templates/postOverlayView.html';

var PostOverlayView = Backbone.View.extend({

	className: 'post-overlay-view',

	template: _.template(template),

	MAX_TEXT_LENGTH: 140,

	events: {
		'keydown textarea': 'changeLengthMarker',
		'keyup textarea': 'changeLengthMarker',
		'click .v-centered': 'clickedModal'
	},

	render: function() {
		var that = this;

		window.Vibe.appRouter.screenRouter.disableScreenScroll();
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
						that.remove();
						return false;
					}
				}
			});
			window.Vibe.appView.headerView.animateToNewComponents('slideDown');
		}, 200);

		this.$el.html(this.template({
			maxTextLength: this.MAX_TEXT_LENGTH
		}));

		this.$textarea = this.$('textarea');
		this.$lengthMarker = this.$('.length-marker');

		this.$textarea.autosize();

		return this;
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

		feedback.save({
			body: inputVal
		}, {
			success: function(model, data) {
				if (data.error) {
					window.Vibe.appView.showNotif(data.error, 2000, 'danger');
					return;
				}
				window.Vibe.appView.showNotif('Feedback sent!');
				that.remove();
			}
		});
	},

	remove: function() {
		window.Vibe.appRouter.screenRouter.enableScreenScroll();
		window.Vibe.appView.headerView.setButtons({
			title: 'vibe',
			rightAction: {
				title: '',
				icon: '#61886',
				click: function(ev) {
					var $target = $(ev.target);
					window.Vibe.appRouter.navigateWithAnimation('settings', 'pushLeft', {
						trigger: true
					});
					return false;
				}
			}
		});
		window.Vibe.appView.headerView.animateToNewComponents('slideDown');

		this.trigger('remove');
		this.$el.addClass('remove');
		_.delay(_.bind(function() {
			this.$el.remove();
		}, this), 280);
	}

});

export default = PostOverlayView;
