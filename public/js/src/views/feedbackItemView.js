import 'underscore';
import 'backbone';

module template from 'text!templates/feedbackItemView.html';
module votingBarTemplate from 'text!templates/votingBarTemplate.html';

var FeedbackItemView = Backbone.View.extend({

	tagName: 'li',

	className: 'feedback-item-view',

	template: _.template(template),
	votingBarTemplate: _.template(votingBarTemplate),

	initialize: function(opts) {
		this.model = opts.model;
		this.model.on('change', this.render, this);
	},

	render: function() {
		var modelJSON = this.model.toJSON();

		this.$el.html(this.template({
			model: modelJSON
		}));

		this.$('.voting-bar-container').html(this.votingBarTemplate({
			model: modelJSON
		}));
		return this;
	}

});

export default = FeedbackItemView;
