import 'underscore';
import 'backbone';

import User from 'models/user';
import Users from 'models/users';
import BaseView from 'views/baseView';
import ConfirmDialogView from 'views/confirmDialogView';
import PostChatView from 'views/postChatView';
import TimeSeriesChartView from 'views/timeSeriesChartView';
import RatingChartView from 'views/ratingChartView';
import Analytics from 'helpers/analytics';

module template from 'text!templates/postQuestionItemView.html';
module actionBarTemplate from 'text!templates/postQuestionItemActionBar.html';
module sentToAdminsTemplate from 'text!templates/postQuestionSentToAdmins.html';

var PostChatView = require('views/postChatView');

var PostQuestionItemView = BaseView.extend({

	className: 'post-question-item-view',

	template: _.template(template),
	actionBarTemplate: _.template(actionBarTemplate),
	sentToAdminsTemplate: _.template(sentToAdminsTemplate),

	events: {
		'tap ul.answers a': 'vote',
		'tap a.discuss': 'discuss',
		'tap a.pull-down': 'adminPullDown'
	},

	initialize: function(opts) {
		if (opts.model) {
			this.model = opts.model;
			this.model.on('destroy', this.remove, this);
			this.question = this.model.get('question');
		} else if (opts.question) {
			this.question = opts.question;
			this.question.once('change', this.render, this);
		}

		this.question.on('newAnswer', this.increaseCompletionPercentage, this);

		this.chartDelay = opts.chartDelay || 0;
		this.forceSmallChart = opts.forceSmallChart || false;
		this.numCompletionUpped = 0;

		this.initChat();
	},

	render: function() {
		if (!this.question.get('body')) {
			return false;
		}

		this.$el.html(this.template({
			question: this.question,
			userSent: new User(this.question.get('user_last_sent')),
			timeSent: moment(this.question.get('time_last_sent')).fromNow()
		}));

		this.$voteResultsContainer = this.$('.vote-results-container');
		this.$chartContainer = this.$('.chart-container');
		this.$actionBarContainer = this.$('.action-bar');
		this.$percentage = this.$('.percentage-voted');

		_.delay(_.bind(function() {
			if (this.question.get('audience') === 'admins') {
				this.renderSentToAdminThanks();
			} else {
				this.renderChart();
			}
			this.delegateEvents();
		}, this), this.chartDelay);

		this.renderActionBar();
	},

	renderActionBar: function() {
		this.$actionBarContainer.html(this.actionBarTemplate({
			numUnread: this.numUnread,
			numTotalChats: this.numTotalChats
		}));

		this.delegateEvents();
	},

	renderChart: function() {
		var question = this.question;

		if (question.get('answer_data').length > 1) {
			this.chartView = new TimeSeriesChartView({
				model: this.question,
				forceSmallChart: this.forceSmallChart
			});
		} else {
			this.chartView = new RatingChartView({
				model: this.question,
				forceSmallChart: this.forceSmallChart
			});
		}

		this.$chartContainer.html(this.chartView.$el);
		this.chartView.render();
	},

	renderSentToAdminThanks: function() {
		var admins = new Users(window.Vibe._data_.admins);
		this.$chartContainer.html(this.sentToAdminsTemplate({
			adminNames: admins.getNames()
		}));
	},

	increaseCompletionPercentage: function() {
		this.numCompletionUpped++;
		this.renderCompletionPercentage();
	},

	renderCompletionPercentage: function() {
		this.$percentage.html(Math.round((this.question.getLatestCompletionPercentage(this.numCompletionUpped) * 100)) + '%');
	},

	vote: function(ev) {
		var $target = $(ev.currentTarget),
			answerBody = parseInt($target.attr('data-answer'), 10);

		this.$voteResultsContainer.addClass('voted');
		this.question.answer(answerBody);

		Analytics.log({
			eventCategory: 'question',
			eventAction: 'voted'
		});

		return false;
	},

	discuss: function() {
		this.postChatView = new PostChatView.default({
			post: this.model,
			question: this.question,
			forceChatPosition: window.isCordova || ($(window).width() < 780)
		});
		window.Vibe.appView.showOverlay(this.postChatView, {
			noAnimation: window.isCordova
		});

		this.markChatOpened();

		window.Vibe.appRouter.navigate('/question/' + this.question.get('_id'));

		Analytics.log({
			eventCategory: 'question',
			eventAction: 'clicked-discuss'
		});

		return false;
	},

	adminPullDown: function() {
		var that = this,
			confirmView = new ConfirmDialogView({
				title: 'Are you sure?',
				body: 'As an admin, you can remove the posts for this question. This will also delete all relevant discussion.',
				onConfirm: function() {
					if (that.model) that.model.trigger('destroy');
					that.question.removePosts();
				}
			});

		Analytics.log({
			eventCategory: 'question',
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
			totalChats = this.question.get('chat').num_chats,
			chatsLastSeen = this.question.get('chat').chats_last_seen,
			myLastSeen = chatsLastSeen ? chatsLastSeen[window.Vibe.user.get('_id')] : false;

		this.numTotalChats = totalChats;

		if (myLastSeen) {
			this.numUnread = totalChats - myLastSeen;
		} else {
			this.numUnread = totalChats;
		}
		this.chatOpen = false;

		window.Vibe.faye.subscribe('/api/questions/' + this.question.get('_id') + '/chats', function(newChat) {
			if (!that.chatOpen) {
				that.numUnread++;
				that.numTotalChats++;
				that.renderActionBar();
			}
		});
	},

	markChatOpened: function() {
		this.chatOpen = true;
		this.numUnread = 0;
		this.renderActionBar();

		this.postChatView.on('remove', _.bind(function() {
			this.chatOpen = false;
			this.question.leaveChat();
			this.postChatView = undefined;
		}, this));
	}

});

export default = PostQuestionItemView;
