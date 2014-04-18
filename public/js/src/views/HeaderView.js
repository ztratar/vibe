import 'backbone';
import 'jquery';
import 'underscore';

module template from 'text!templates/HeaderView.html';

var HeaderView = Backbone.View.extend({

	className: 'header-view',

	initialize: function(opts) {
		this.data = {
			title: 'vibe',
			leftAction: {},
			rightAction: {}
		};
	},

	render: function() {
		this.$el.html(_.template(template, this.data));
	}

});

export default = HeaderView;
