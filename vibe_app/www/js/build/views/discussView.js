define("views/discussView", 
  ["backbone","models/chatMessage","models/chatMessages","views/chatMessageView","text!templates/discussView.html","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __dependency5__, __exports__) {
    "use strict";
    var ChatMessage = __dependency2__["default"];
    var ChatMessages = __dependency3__["default"];
    var ChatMessageView = __dependency4__["default"];

    var template = __dependency5__;

    var DiscussView = Backbone.View.extend({

    	className: 'discuss-view',

    	template: _.template(template),

    	events: {
    		'keydown input': 'addChatMessage'
    	},

    	initialize: function() {
    		this.chatMessages = new ChatMessages([{
    			text: 'sup'
    		},{
    			text: 'hey man'
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

    __exports__["default"] = DiscussView;
  });