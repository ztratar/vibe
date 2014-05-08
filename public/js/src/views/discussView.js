import 'backbone';
import ChatMessage from 'models/chatMessage';
import ChatMessages from 'models/chatMessages';
import ChatMessageView from 'views/chatMessageView';

module template from 'text!templates/discussView.html';

var DiscussView = Backbone.View.extend({

	className: 'discuss-view',

	template: _.template(template),

	events: {
		'keydown input': 'addChatMessage'
	},

	initialize: function() {
		this.chatMessages = new ChatMessages([{
			text: 'Anyone know why the numbers here are going up? Let\'s celebrate!'
		}]);
		this.chatMessages.on('add', _.bind(this.addOne, this));
		this.chatMessages.on('reset', _.bind(this.addAll, this));
	},

	render: function() {
		this.$el.html(this.template());
		this.$textInput = this.$('input');
		this.$chatMessagesContainer = this.$('.chatMessages');
		this.addAll();
		return this;
	},

	addChatMessage: function(ev) {
		if (ev && ev.keyCode === 13) {
			var chatMessageText = this.$textInput.val(),
				chatMessage;	

			if (chatMessageText && chatMessageText.length) {
				this.$textInput.val('');	
				chatMessage = new ChatMessage({
					text: chatMessageText
				});
				this.chatMessages.add(chatMessage);
				_.defer(_.bind(function() {
					this.$chatMessagesContainer.scrollTop(10000);
				}, this));
			}

			ev.preventDefault();
			ev.stopPropagation();
			return false;
		}
	},

	addOne: function(chatMessage) {
		var chatMessageView = new ChatMessageView({
			model: chatMessage
		});	
		this.$chatMessagesContainer.append(chatMessageView.$el);
		chatMessageView.render();
	},

	addAll: function() {
		this.$chatMessagesContainer.empty();
		this.chatMessages.each(_.bind(this.addOne, this));
	}

});

export default = DiscussView;
