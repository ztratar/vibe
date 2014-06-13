import 'backbone';

module template from 'text!templates/confirmDialogView.html';

var ConfirmDialogView = Backbone.View.extend({

	className: 'confirm-dialog-view',

	template: _.template(template),

	events: {
		'click a.cancel': 'cancel',
		'click a.confirm': 'confirm'
	},

	initialize: function(opts) {
		_.extend(this, {
			title: '',
			body: '',
			confirmText: 'Confirm',
			cancelText: 'Cancel',
			onConfirm: function() {},
			onCancel: function() {}
		}, opts);
	},

	render: function() {
		this.$el.html(this.template({
			title: this.title,
			body: this.body,
			cancelText: this.cancelText,
			confirmText: this.confirmText
		}));
	},

	cancel: function() {
		this.onCancel();
		this.remove();
		return false;
	},

	confirm: function() {
		this.onConfirm();
		this.remove();
		return false;
	},

	remove: function() {
		this.trigger('remove');
		this.$el.remove();
	}

});

export default = ConfirmDialogView;
