import 'backbone';
import Post from 'models/post';

var Posts = Backbone.Collection.extend({

	model: Post,

	comparator: function(a,b) {
		return Date.parse(a.get('time_created')) < Date.parse(b.get('time_created'));
	},

	getNew: function() {
		var mostRecentModel = this.first(),
			that = this;

		if (!mostRecentModel) {
			return false;
		}

		this.currentlyFetching = true;
		this.fetch({
			url: this.url + '?afterId=' + mostRecentModel.get('_id'),
			remove: false,
			success: function() {
				that.currentlyFetching = false;
			}
		});
	},

	getMore: function() {
		var lastModel = this.last(),
			that = this;

		if (!lastModel) return false;

		this.currentlyFetching = true;
		this.fetch({
			url: this.url + '?beforeId=' + lastModel.get('_id'),
			remove: false,
			success: function(model, data) {
				that.currentlyFetching = false;
				if (!data.length) that.atLastItem = true
			}
		});
	}

});

export default = Posts;