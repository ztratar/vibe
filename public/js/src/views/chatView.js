import 'backbone';

import Chat from 'models/chat';
import Chats from 'models/chats';

module template from 'text!templates/chatView.html';
module chatTemplate from 'text!templates/chatItem.html';
module chatEmptyStateTemplate from 'text!templates/chatEmptyState.html';
module loaderTemplate from 'text!templates/loader.html';

var ChatView = Backbone.View.extend({

	className: 'chat-view',

	template: _.template(template),
	chatTemplate: _.template(chatTemplate),
	chatEmptyStateTemplate: _.template(chatEmptyStateTemplate),
	loaderTemplate: _.template(loaderTemplate),

	events: {
		'keydown form input': 'newChat',
		'click form button': 'newChat',
		'click .close-chat': 'closeChat'
	},

	initialize: function(opts) {
		var that = this;

		this.chats = new Chats();
		this.chats.url = opts.chatsUrl;

		this.chats.on('reset', this.addAll, this);
		this.chats.on('add', this.addOne, this);

		this.chatTitle = opts.chatTitle || 'Chat';

		this.chatItemTimes = [];

		if (opts.closeChat) {
			this.customCloseChat = opts.closeChat;
		}

		_.defer(function() {
			window.Vibe.faye.subscribe(that.chats.url.replace(window.Vibe.serverUrl, '/'), function(chatModel) {
				that.chats.add(chatModel);

				if (chatModel.creator.ref === window.Vibe.user.get('_id')) {
					that.scrollToBottom();
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
			that.$input.focus();
		}, 100);

		this.addAll();
		this.scrollToBottom();

		this.chatTimeUpdateInterval = setInterval(function() {
			_.each(that.chatItemTimes, function(chatItemTime) {
				chatItemTime.elem.html(moment(chatItemTime.time).fromNow());
			});
		}, 5000);

		_.delay(function() {
			that.infScrollHandler();
		}, 800);

		this.on('remove', function() {
			clearInterval(that.chatTimeUpdateInterval);
		});

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
		var newChatItem = this.chatTemplate({
				body: chat.get('body'),
				userAvatar: window.Vibe.config.cloudfrontDomain + chat.get('creator').avatar,
				timeago: moment(chat.get('time_created')).fromNow()
			}),
			$chatElem = $('<div/>');

		$chatElem.html(newChatItem);

		if (this.emptyState) {
			this.$chatsContainer.html('');
			this.emptyState = false;
		}

		var currentScrollTop = this.$chatScrollContainer.scrollTop(),
			scrollHeight = this.$chatScrollContainer[0].scrollHeight - this.$chatScrollContainer.height(),
			atBottom = (currentScrollTop >= scrollHeight - 40);

		if (this.chats.indexOf(chat) === 0) {
			this.$chatsContainer.append($chatElem);
		} else {
			this.$chatsContainer.prepend($chatElem);
		}

		this.chatItemTimes.push({
			elem: $chatElem.find('span.time'),
			time: chat.get('time_created')
		});

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
