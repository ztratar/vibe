import 'backbone';
import 'require';

import BaseView from 'views/baseView';
import FeedbackItemView from 'views/feedbackItemView';
import PostQuestionItemView from 'views/postQuestionItemView';
import ChatView from 'views/chatView';
import CarouselHelper from 'helpers/carouselHelper';

module template from 'text!templates/postChatView.html';

var FeedbackItemView = require('views/feedbackItemView'),
	PostQuestionItemView = require('views/postQuestionItemView');

var PostChatView = BaseView.extend({

	className: 'post-chat-view',

	template: _.template(template),

	events: {
		'tap .close-modal': 'tapRemove'
	},

	initialize: function(opts) {
		if (opts.post) {
			this.post = opts.post;
			this.postType = this.post.get('content_type');
			if (this.postType === 'feedback') {
				this.feedback = this.post.get('feedback');
			} else {
				this.question = this.post.get('question');
			}
		} else if (opts.question) {
			this.postType = 'question';
			this.question = opts.question;
		} else if (opts.feedback) {
			this.postType = 'feedback';
			this.feedback = opts.feedback;
		}

		this.forceChatPosition = opts.forceChatPosition || false;

		this.closeUrl = opts.closeUrl || '';
	},

	render: function() {
		var that = this;

		this.$el.html(this.template());

		this.$sectionWrapper = this.$('.post-chat-view-section-wrapper');
		this.$chatContainer = this.$('.chat-container');
		this.$postContainer = this.$('.post-container');

		this.renderPost();
		this.renderChat();

		var carousel = new CarouselHelper(this.$el, {
			container: this.$sectionWrapper,
			paneSelector: '.pane',
			isEnabled: function() {
				return ($(window).width() <= 767);
			},
			onPaneShow: function(index, animate) {
				if (index === 0) {
					if (window.isCordova) {
						cordova.plugins.Keyboard.close();
					}
				}
				if (index === 1 && !window.isCordova) {
					that.chatView.$input.focus();
				}
			}
		});
		carousel.init();

		if (this.forceChatPosition) {
			carousel.showPane(1, false);
		}

		_.delay(function() {
			window.carousel = carousel;
			carousel.setPaneDimensions();

			if (window.isCordova) {
				window.Vibe.appRouter.screenRouter.currentScreen.hide();
			}
		}, 280);

		this.delegateEvents();

		if (!window.isCordova) {
			_.delay(function() {
				that.chatView.$input.focus();
			}, 420);
		}

		return this;
	},

	renderPost: function() {
		if (this.postType === 'feedback') {
			// Circular dependency.
			this.postView = new FeedbackItemView.default({
				model: this.post,
				feedback: this.feedback
			});
		} else {
			this.postView = new PostQuestionItemView.default({
				model: this.post,
				question: this.question,
				chartDelay: 200,
				forceSmallChart: true
			});
		}

		this.$postContainer.html(this.postView.$el);
		this.postView.render();
	},

	renderChat: function() {
		var that = this,
			apiResourceUrl = (this.postType === 'question') ? this.postType+'s' : this.postType,
			apiResourceId = (this.postType === 'question') ? this.question.get('_id') : this.feedback.get('_id');

		this.chatView = new ChatView({
			chatsUrl: window.Vibe.serverUrl + 'api/' + apiResourceUrl + '/' + apiResourceId + '/chats',
			closeChat: function() {
				that.remove();
			}
		});

		this.$chatContainer.html(this.chatView.$el);
		this.chatView.render();
	},

	tapRemove: function(ev) {
		var $target = $(ev.target);
		if ($target.hasClass('close-modal')) {
			this.remove();
		}
	},

	remove: function() {
		if (this.removing) return;
		this.removing = true;

		if (window.isCordova) {
			window.Vibe.appRouter.screenRouter.currentScreen.show();
		}

		this.once('remove-done', _.bind(function() {
			window.Vibe.appRouter.navigate(this.closeUrl);
			this.chatView.closeChat();
			this.$el.remove();
		}, this));

		this.trigger('remove');
	}

});

export default = PostChatView;
