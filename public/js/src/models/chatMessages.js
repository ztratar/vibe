import 'backbone';
import ChatMessage from 'models/chatMessage';

var ChatMessages = Backbone.Collection.extend({
	model: ChatMessage
});

export default = ChatMessages;
