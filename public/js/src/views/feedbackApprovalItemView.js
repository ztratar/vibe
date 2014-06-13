import 'backbone';
module moment from 'moment';

module template from 'text!templates/feedbackApprovalItemView.html';

var FeedbackApprovalItemView = Backbone.View.extend({

	tagName: 'li',

	template: _.template(template),

	events: {
		'click a.approve': 'approve',
		'click a.disapprove': 'reject'
	},

	initialize: function(opts) {
		this.model = opts.model;
		this.feedbacks = opts.feedbacks;
		this.model.on('change', this.render, this);
	},

	render: function() {
		if (this.model.get('status') !== 'pending') {
			this.feedbacks.remove(this.model);
			this.remove();
		} else {
			this.$el.html(this.template({
				model: this.model.toJSON(),
				time_created: moment(this.model.get('time_created')).fromNow()
			}));
		}
		return this;
	},

	approve: function() {
		this.model.approve();
		return false;
	},

	reject: function() {
		this.model.reject();
		return false;
	}

});

export default = FeedbackApprovalItemView;
