// headerView.js
// 
// Future home of the header view

import 'backbone';
import 'jquery';

var HeaderView = Backbone.View.extend({
	className: 'test',
	render: function() {
		this.$el.html('i am a test');
	}
});

export default = HeaderView;
