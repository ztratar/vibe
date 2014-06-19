import 'backbone';

import Chat from 'models/chat';
import Chats from 'models/chats';

module template from 'text!templates/chatView.html';
module chatTemplate from 'text!templates/chatItem.html';

var ChatView = Backbone.View.extend({

	className: 'chat-view',

	template: _.template(template),
	chatTemplate: _.template(chatTemplate),

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

		_.defer(function() {
			window.Vibe.faye.subscribe(that.chats.url, function(chatModel) {
				that.chats.add(chatModel);
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
		this.$chatsContainer = this.$('.chats-container');

		_.delay(function() {
			that.$input.focus();
		}, 100);

		this.addAll();
		this.scrollToBottom();

		return this;
	},

	addAll: function() {
		this.chats.each(this.addOne, this);
	},

	addOne: function(chat) {
		var newChatItem = this.chatTemplate({
			body: chat.get('body'),
			userAvatar: chat.get('creator').avatar,
			timeago: moment(chat.get('time_created')).fromNow()
		});

		window.chats = this.chats;

		if (this.chats.indexOf(chat) === 0) {
			this.$chatsContainer.append(newChatItem);
		} else {
			this.$chatsContainer.prepend(newChatItem);
		}

		this.scrollToBottom();
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

		this.chats.add(chat);

		chat.save({}, {
			url: this.chats.url,
			success: function(model, data) {
				window.Vibe.faye.publish(that.chats.url, model);
			}
		});

		this.$input.val('');

		return false;
	},

	scrollToBottom: function() {
		this.$chatsContainer.scrollTop(this.$chatsContainer[0].scrollHeight);
	},

	closeChat: function() {
		this.trigger('remove');

		return false;
	}

});

export default = ChatView;
