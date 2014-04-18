import 'backbone';
module template from 'text!templates/welcomeView.html';

var WelcomeView = Backbone.View.extend({
	template: _.template(template),
	render: function() {
		this.$el.html(this.template());
		return this;
	}
});

export default = WelcomeView;
