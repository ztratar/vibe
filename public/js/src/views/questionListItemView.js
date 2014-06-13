import 'backbone';

module template from 'text!templates/questionListItemView.html';

var QuestionListItemView = Backbone.View.extend({

	tagName: 'li',

	template: _.template(template),

	events: {
		'click a': 'actionTriggered'
	},

	initialize: function(opts) {
		opts = opts || {};

		this.button = opts.button || {};

		this.model.on('change', this.render, this);
		this.model.on('destroy', this.remove, this);
	},

	render: function() {
		var that = this;

		this.$el.html(this.template({
			model: this.model.toJSON(),
			className: this.button.className,
			icon: this.button.icon
		}));

		return this;
	},

	actionTriggered: function() {
		if (this.button.click) {
			return this.button.click(this.model);
		}

		return false;
	}

});

export default = QuestionListItemView;