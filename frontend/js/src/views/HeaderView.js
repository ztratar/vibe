import 'backbone';
import 'jquery';

var HeaderView = Backbone.View.extend({
	className: 'header-view',
	render: function() {
		this.$el.html('header');
	}
});

export default = HeaderView;
