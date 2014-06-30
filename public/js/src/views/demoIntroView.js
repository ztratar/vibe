import 'backbone';

module template from 'text!templates/demoIntroView.html';

var DemoIntroView = Backbone.View.extend({

	className: 'demo-intro-view',

	template: _.template(template),

	events: {
		'click a.confirm': 'confirm'
	},

	render: function() {
		this.paneNum = 1;

		this.$el.html(this.template());
	},

	confirm: function() {
		this.paneNum++;

		if (this.paneNum === 5) {
			this.remove();
		}

		this.$('.demo-pane.active')
			.addClass('done')
			.next()
			.addClass('active');

		if (this.paneNum === 4) {
			this.$('a.btn.confirm')
				.html('Let me in!');
		}

		return false;
	},

	remove: function() {
		this.trigger('remove');
		this.$el.remove();
	}

});

export default = DemoIntroView;
