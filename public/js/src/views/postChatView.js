import 'backbone';
import 'require';

import FeedbackItemView from 'views/feedbackItemView';
import PostQuestionItemView from 'views/postQuestionItemView';
import ChatView from 'views/chatView';
import CarouselHelper from 'helpers/carouselHelper';

module template from 'text!templates/postChatView.html';

var FeedbackItemView = require('views/feedbackItemView'),
	PostQuestionItemView = require('views/postQuestionItemView');

var PostChatView = Backbone.View.extend({

	className: 'post-chat-view',

	template: _.template(template),

	initialize: function(opts) {
		this.post = opts.post;
		this.postType = this.post.get('content_type');

		if (this.postType === 'feedback') {
			this.feedback = this.post.get('feedback');
		} else {
			this.question = this.post.get('question');
		}
	},

	render: function() {
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
			}
		});
		carousel.init();

		_.delay(function() {
			window.carousel = carousel;
			carousel.setPaneDimensions();
		}, 280);

		return this;
	},

	renderPost: function() {
		if (this.postType === 'feedback') {
			// Circular dependency.
			this.postView = new FeedbackItemView.default({
				model: this.post
			});
		} else {
			this.postView = new PostQuestionItemView.default({
				model: this.post,
				chartDelay: 200,
				forceSmallChart: true
			});
		}

		this.$postContainer.html(this.postView.$el);
		this.postView.render();
	},

	renderChat: function() {
		var that = this,
			apiResourceUrl = (this.postType === 'question') ? this.postType+'s' : this.postType;

		this.chatView = new ChatView({
			chatsUrl: window.Vibe.serverUrl + 'api/' + apiResourceUrl + '/' + this.post.get(this.postType).get('_id') + '/chats',
			closeChat: function() {
				that.remove();
			}
		});

		this.$chatContainer.html(this.chatView.$el);
		this.chatView.render();
	},

	remove: function() {
		this.once('remove-done', _.bind(function() {
			this.chatView.closeChat();
			this.$el.remove();
		}, this));

		this.trigger('remove');
	}

});

export default = PostChatView;
