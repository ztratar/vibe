import 'backbone';
import Analytics from 'helpers/analytics';
import ConfirmDialogView from 'views/confirmDialogView';

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
		Analytics.log({
			'eventCategory': 'post',
			'eventAction': 'approved'
		});

		this.model.approve();
		return false;
	},

	reject: function() {
		var that = this,
			confirmDialog = new ConfirmDialogView({
				title: 'Please give a reason',
				body: 'We will forward it on!',
				textarea: true,
				onConfirm: function(reasonVal) {
					that.model.reject(reasonVal);

					Analytics.log({
						'eventCategory': 'post',
						'eventAction': 'rejected',
						'eventLabel': reasonVal
					});
				}
			});

		Analytics.log({
			'eventCategory': 'post',
			'eventAction': 'reject-clicked'
		});

		window.Vibe.appView.showOverlay(confirmDialog);

		return false;
	}

});

export default = FeedbackApprovalItemView;
