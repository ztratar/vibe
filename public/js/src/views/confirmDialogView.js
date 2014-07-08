import 'backbone';
import BaseView from 'views/baseView';

module template from 'text!templates/confirmDialogView.html';

var ConfirmDialogView = BaseView.extend({

	className: 'confirm-dialog-view close-modal',

	template: _.template(template),

	events: {
		'tap a.cancel': 'cancel',
		'tap a.confirm': 'confirm'
	},

	initialize: function(opts) {
		_.extend(this, {
			title: '',
			body: '',
			textarea: false,
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
			textarea: this.textarea,
			cancelText: this.cancelText,
			confirmText: this.confirmText
		}));

		this.$textarea = this.$('textarea');

		if (this.$textarea) {
			_.delay(_.bind(function() {
				this.$textarea.focus();
			}, this), 200);
		}

		this.delegateEvents();
	},

	cancel: function() {
		this.onCancel();
		this.remove();
		return false;
	},

	confirm: function() {
		var textVal = this.$textarea ? this.$textarea.val() : undefined;

		this.onConfirm(textVal);
		this.remove();
		return false;
	},

	remove: function() {
		this.trigger('remove');
		this.$el.remove();
	}

});

export default = ConfirmDialogView;
