import 'backbone';

module template from 'text!templates/userListItemView.html';

var UserListItemView = Backbone.View.extend({

	tagName: 'li',

	template: _.template(template),

	initialize: function(opts) {
		opts = opts || {};

		if (opts.buttons) {
			this.buttons = opts.buttons;
		}

		this.model.on('change', this.render, this);
		this.model.on('destroy', this.remove, this);
	},

	render: function() {
		var that = this;

		this.$el.html(this.template({
			model: this.model.toJSON(),
			avatar: this.model.getAvatar(),
			buttons: this.buttons
		}));

		if (this.buttons && this.buttons.length) {
			_.each(this.buttons, function(button, i) {
				that.$('a.button:eq('+i+')').on('click', function() {
					button.click(that.model);
					return false;
				});
			});
		}
		return this;
	}

});

export default = UserListItemView;
