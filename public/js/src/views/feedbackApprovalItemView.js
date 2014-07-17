import 'backbone';
import BaseView from 'views/baseView';
import Analytics from 'helpers/analytics';
import ConfirmDialogView from 'views/confirmDialogView';

module moment from 'moment';
module template from 'text!templates/feedbackApprovalItemView.html';

var FeedbackApprovalItemView = BaseView.extend({

	tagName: 'li',

	template: _.template(template),

	events: {
		'tap a.send-to-all': 'sendToAll',
		'tap a.archive': 'archive'
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

		this.delegateEvents();

		return this;
	},

	sendToAll: function() {
		Analytics.log({
			'eventCategory': 'post',
			'eventAction': 'sent-to-all'
		});

		this.model.sendToAll();
		return false;
	},

	archive: function(ev) {
		var that = this,
			confirmDialog = new ConfirmDialogView({
				title: 'Any thoughts?',
				body: 'We will forward it on!',
				textarea: true,
				confirmText: 'Done',
				onConfirm: function(reasonVal) {
					that.model.archive(reasonVal);

					Analytics.log({
						'eventCategory': 'post',
						'eventAction': 'archived',
						'eventLabel': reasonVal
					});
				}
			});

		Analytics.log({
			'eventCategory': 'post',
			'eventAction': 'archive-clicked'
		});

		window.Vibe.appView.showOverlay(confirmDialog);

		ev.preventDefault();
		ev.stopPropagation();

		return false;
	}

});

export default = FeedbackApprovalItemView;
