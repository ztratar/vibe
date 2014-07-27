import 'backbone';
import BaseView from 'views/baseView';
import pushNotificationHelper from 'helpers/pushNotificationHelper';

module template from 'text!templates/askPushNotificationView.html';

var AskPushNotificationView = BaseView.extend({

	className: 'ask-push-notification-view',

	template: _.template(template),

	events: {
		'tap a.accept': 'accept'
	},

	initialize: function(opts) {
		this.onFinish = opts.onFinish;
	},

	render: function() {
		this.$el.html(this.template());
		this.delegateEvents();

		return this;
	},

	accept: function() {
		pushNotificationHelper.register(this.onFinish);
		return false;
	}

});

export default = AskPushNotificationView;
