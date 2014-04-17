import 'backbone';
import 'jquery';

module template from 'text!templates/AppView.html';

var AppView = Backbone.View.extend({
	el: 'body',
	className: 'vibe-app',
	render: function() {
		this.$el.html(template);
	}
});

export default = AppView;
