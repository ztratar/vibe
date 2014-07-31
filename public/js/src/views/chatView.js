import 'backbone';

import BaseView from 'views/baseView';
import Chat from 'models/chat';
import Chats from 'models/chats';
import Analytics from 'helpers/analytics';
import ChatItemView from 'views/chatItemView';

module template from 'text!templates/chatView.html';
module chatEmptyStateTemplate from 'text!templates/chatEmptyState.html';
module loaderTemplate from 'text!templates/loader.html';

var ChatView = BaseView.extend({

	className: 'chat-view',

	template: _.template(template),
	chatEmptyStateTemplate: _.template(chatEmptyStateTemplate),
	loaderTemplate: _.template(loaderTemplate),

	events: {
		'keydown form input': 'newChat',
		'tap form button': 'newChat',
		'tap .close-chat': 'closeChat'
	},

	initialize: function(opts) {
		var that = this;

		this.chats = new Chats();
		this.chats.url = opts.chatsUrl;

		this.chats.on('reset', this.addAll, this);
		this.chats.on('add', this.addOne, this);

		this.chatTitle = opts.chatTitle || 'Chat';

		this.chatViews = [];

		if (opts.closeChat) {
			this.customCloseChat = opts.closeChat;
		}

		_.defer(function() {
			window.Vibe.faye.subscribe(that.chats.url.replace(window.Vibe.serverUrl, '/'), function(chatModel) {
				if (chatModel.creator.ref !== window.Vibe.user.get('_id')) {
					that.chats.add(chatModel);
				}
			});
			that.chats.fetch({
				reset: true
			});
		});
	},

	render: function() {
		var that = this;

		this.$el.html(this.template({
			title: this.chatTitle
		}));

		this.$input = this.$('.form-inline input');
		this.$chatScrollContainer = this.$('.chat-scroll-container');
		this.$chatsContainer = this.$('.chats-container');
		this.$chatsLoaderContainer = this.$('.chats-loader-container');

		_.delay(function() {
			if (!window.isCordova) {
				that.$input.focus();
			}
		}, 100);

		this.addAll();
		this.scrollToBottom();

		_.delay(function() {
			that.infScrollHandler();
		}, 800);

		this.on('remove', function() {
			_.each(that.chatViews, function(chatView) {
				chatView.stopUpdateTime();
			});
		});

		Analytics.log({
			'eventCategory': 'chat',
			'eventAction': 'loaded'
		});

		this.delegateEvents();

		return this;
	},

	addAll: function() {
		if (this.chats.length) {
			this.$chatsContainer.html('');
			this.chats.each(this.addOne, this);
		} else {
			this.emptyState = true;
			this.$chatsContainer.html(this.chatEmptyStateTemplate());
		}

		this.scrollToBottom();
	},

	addOne: function(chat) {
		var chatItemView = new ChatItemView({
			model: chat
		});

		if (this.emptyState) {
			this.$chatsContainer.html('');
			this.emptyState = false;
		}

		var currentScrollTop = this.$chatScrollContainer.scrollTop(),
			scrollHeight = this.$chatScrollContainer[0].scrollHeight - this.$chatScrollContainer.height(),
			atBottom = (currentScrollTop >= scrollHeight - 40);

		if (this.chats.indexOf(chat) === 0) {
			this.$chatsContainer.append(chatItemView.$el);
		} else {
			this.$chatsContainer.prepend(chatItemView.$el);
		}
		chatItemView.render();

		this.chatViews.push(chatItemView);

		if (atBottom) {
			this.scrollToBottom();
		}

		this.trigger('infScrollLoaded');
	},

	newChat: function(ev) {
		if (ev.type === 'keydown' && ev.keyCode !== 13) {
			return;
		}

		var that = this,
			inputVal = this.$input.val(),
			chat;

		if (!inputVal) return false;

		chat = new Chat({
			creator: {
				name: window.Vibe.user.get('name'),
				avatar: window.Vibe.user.get('avatar')
			},
			body: inputVal,
			time_created: new Date().toISOString()
		});

		chat.save({}, {
			url: this.chats.url
		});

		this.$input.val('');
		that.chats.add(chat);
		that.scrollToBottom();

		Analytics.log({
			'eventCategory': 'chat',
			'eventAction': 'new-chat'
		});

		return false;
	},

	scrollToBottom: function() {
		this.$chatScrollContainer.scrollTop(this.$chatScrollContainer[0].scrollHeight);
	},

	infScrollHandler: function() {
		var that = this,
			$scrollContainer = this.$chatScrollContainer,
			prevScrollHeight,
			newScrollHeight,
			verticalOffset = 100;

		$scrollContainer
			.off('scroll.chatsInfScroll')
			.on('scroll.chatsInfScroll', _.throttle(function() {
				var targetScroll = verticalOffset,
					currentScroll = $scrollContainer.scrollTop();

				if (currentScroll <= targetScroll
						&& !that.chats.currentlyFetching
						&& !that.chats.atLastItem) {

					that.once('infScrollLoaded', function() {
						_.defer(function() {
							newScrollHeight = $scrollContainer[0].scrollHeight;
							var heightDiff = newScrollHeight - prevScrollHeight;
							$scrollContainer.scrollTop($scrollContainer.scrollTop() + heightDiff);
						});
					});

					prevScrollHeight = $scrollContainer[0].scrollHeight;
					that.chats.getMore();
				}
			}, 16));
	},

	showLoader: function() {
		this.$chatsLoaderContainer.html(this.loaderTemplate({ useDark: true }));
	},

	removeLoader: function() {
		this.$chatsLoaderContainer.html('');
	},

	closeChat: function() {
		if (this.customCloseChat) {
			this.customCloseChat();
		} else {
			this.trigger('remove');
			this.remove();
		}

		return false;
	}

});

export default = ChatView;
