import 'backbone';
module moment from 'moment';

module template from 'text!templates/feedbackApprovalItemView.html';

var FeedbackApprovalItemView = Backbone.View.extend({

	tagName: 'li',

	template: _.template(template),

	initialize: function(opts) {
		this.model = opts.model;
		this.model.on('change', this.render, this);
	},

	render: function() {
		this.$el.html(this.template({
			model: this.model.toJSON(),
			time_created: moment(this.model.get('time_created')).fromNow()
		}));
		return this;
	}

});

export default = FeedbackApprovalItemView;
