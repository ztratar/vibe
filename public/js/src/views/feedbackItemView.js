import 'underscore';
import 'backbone';

import BaseView from 'views/baseView';
import ConfirmDialogView from 'views/confirmDialogView';
import PostChatView from 'views/postChatView';
import Analytics from 'helpers/analytics';

module template from 'text!templates/feedbackItemView.html';

var FeedbackItemView = BaseView.extend({

	className: 'feedback-item-view',

	template: _.template(template),

	events: {
		'tap a.agree': 'agree',
		'tap a.agreed': 'undoAgree',
		'tap a.discuss': 'discuss',
		'tap a.pull-down': 'adminPullDown'
	},

	initialize: function(opts) {
		var that = this;

		if (opts.model) {
			this.model = opts.model;
			this.model.on('change', this.render, this);
			this.model.on('destroy', this.remove, this);
			this.feedback = this.model.get('feedback');
		} else if (opts.feedback) {
			this.feedback = opts.feedback;
		}

		this.feedback.on('change', this.render, this);

		this.initChat();

		window.Vibe.faye.subscribe('/api/feedback/' + this.feedback.get('_id') + '/vote_change', function(newNumVotes) {
			if (newNumVotes === that.feedback.get('num_votes')) {
				return;
			}

			that.feedback.set({
				'num_votes': newNumVotes
			});
			that.$agree.addClass('pop');

			setTimeout(function() {
				that.$agree.removeClass('pop');
			}, 500);
		});
	},

	render: function() {
		this.$el.html(this.template({
			feedback: this.feedback,
			numUnread: this.numUnread,
			numTotalChats: this.numTotalChats
		}));

		this.$agree = this.$('.agree i, .agreed i');

		this.delegateEvents();
		return this;
	},

	agree: function() {
		var that = this,
			feedback = this.feedback;

		feedback.agree();

		this.$agree.addClass('pop');

		setTimeout(function() {
			that.$agree.removeClass('pop');
		}, 500);

		Analytics.log({
			eventCategory: 'feedback',
			eventAction: 'clicked-agree'
		});

		return false;
	},

	undoAgree: function() {
		var that = this,
			feedback = this.feedback;

		feedback.undoAgree();

		return false;
	},

	discuss: function() {
		this.postChatView = new PostChatView({
			post: this.model,
			feedback: this.feedback,
			forceChatPosition: window.isCordova || ($(window).width() < 780)
		});
		window.Vibe.appView.showOverlay(this.postChatView, {
			noAnimation: window.isCordova
		});

		this.markChatOpened();

		window.Vibe.appRouter.navigate('/feedback/' + this.feedback.get('_id'));

		Analytics.log({
			eventCategory: 'feedback',
			eventAction: 'clicked-discuss'
		});

		return false;
	},

	adminPullDown: function() {
		var that = this,
			confirmView = new ConfirmDialogView({
				title: 'Are you sure?',
				body: 'As an admin, you can remove this piece of feedback instantly by clicking confirm. This will also delete all relevant discussion.',
				onConfirm: function() {
					if (that.model) that.model.trigger('destroy');
					that.feedback.pullDown();
				}
			});

		Analytics.log({
			eventCategory: 'feedback',
			eventAction: 'clicked-admin-pulldown'
		});

		window.Vibe.appView.showOverlay(confirmView);

		return false;
	},



	// ************
	// CHAT METHODS
	// ************

	initChat: function() {
		var that = this,
			totalChats = this.feedback.get('chat').num_chats,
			chatsLastSeen = this.feedback.get('chat').chats_last_seen,
			myLastSeen = chatsLastSeen ? chatsLastSeen[window.Vibe.user.get('_id')] : false;

		this.numTotalChats = totalChats;

		if (myLastSeen) {
			this.numUnread = totalChats - myLastSeen;
		} else {
			this.numUnread = totalChats;
		}
		this.chatOpen = false;

		window.Vibe.faye.subscribe('/api/feedback/' + this.feedback.get('_id') + '/chats', function(newChat) {
			if (!that.chatOpen) {
				that.numUnread++;
				that.numTotalChats++;
				that.render();
			}
		});
	},

	markChatOpened: function() {
		this.chatOpen = true;
		this.numUnread = 0;
		this.render();

		this.postChatView.on('remove', _.bind(function() {
			this.chatOpen = false;
			this.feedback.leaveChat();
			this.postChatView = undefined;
		}, this));
	}

});

export default = FeedbackItemView;
