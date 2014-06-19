import 'backbone';
import Chat from 'models/chat';

var Chats = Backbone.Collection.extend({

	model: Chat,

	comparator: function(a,b) {
		console.log(a.get('time_created'), Date.parse(a.get('time_created')));
		return Date.parse(a.get('time_created')) > Date.parse(b.get('time_created'));
	},

	getMore: function() {
		var lastModel = this.last(),
			that = this;

		if (!lastModel) return false;

		this.currentlyFetching = true;
		this.trigger('currentlyFetching');
		this.fetch({
			url: this.url + '?beforeId=' + lastModel.get('_id'),
			remove: false,
			success: function(model, data) {
				that.currentlyFetching = false;
				that.trigger('fetchingDone');
				if (!data.length) that.atLastItem = true
			}
		});
	}

});

export default = Chats;
