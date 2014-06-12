import 'backbone';

module template from 'text!templates/postItemView.html';

var PostItemView = Backbone.View.extend({

	tagName: 'li',

	template: _.template(template),

	events: {
	},

	initialize: function(opts) {
		opts = opts || {};

		this.model = opts.model;

		this.model.on('change', this.render, this);
		this.model.on('destroy', this.remove, this);
	},

	render: function() {
		var that = this;

		this.$el.html(this.template({
			model: this.model.toJSON()
		}));

		return this;
	}

});

export default = PostItemView;
