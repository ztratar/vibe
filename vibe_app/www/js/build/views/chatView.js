define("views/chatView", 
  ["backbone","models/chats","text!templates/chatView.html","text!templates/chatItem.html","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __exports__) {
    "use strict";

    var Chats = __dependency2__["default"];

    var template = __dependency3__;
    var chatTemplate = __dependency4__;

    var ChatView = Backbone.View.extend({

    	className: 'chat-view',

    	template: _.template(template),

    	events: {
    		'keydown form input': 'newChat',
    		'click form button': 'newChat',
    		'click .close-chat': 'closeChat'
    	},

    	initialize: function(opts) {
    		this.chats = new Chats();
    		this.chats.url = opts.chatsUrl;

    		this.chats.on('reset', this.addAll, this);
    		this.chats.on('add', this.addOne, this);

    		this.chatTitle = opts.chatTitle || 'Chat';

    		_.defer(_.bind(function() {
    			this.chats.fetch();
    		}, this));
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
    		this.$chatsContainer.append(this.chatTemplate({
    			body: chat.get('body'),
    			userAvatar: chat.get('user').get('avatar'),
    			timeago: moment(chat.get('time_created')).fromNow()
    		}));

    		this.scrollToBottom();
    	},

    	newChat: function(ev) {
    		if (ev.type === 'keydown' && ev.keyCode !== 13) {
    			return;
    		}

    		var inputVal = this.$input.val();

    		if (!inputVal) return false;

    		this.chats.add({
    			user: window.Vibe.user,
    			body: inputVal,
    			time_created: Date.now()
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

    __exports__["default"] = ChatView;
  });