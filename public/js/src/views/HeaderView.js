import 'backbone';
import 'jquery';
import 'underscore';

module template from 'text!templates/HeaderView.html';

var HeaderView = Backbone.View.extend({

	className: 'header-view',

	initialize: function(opts) {
		this.data = {
			title: 'vibe',
			leftAction: undefined,
			rightAction: undefined
		};

		this.data.leftAction = {
			icon: '&#61903'
		}

		this.data.rightAction = {
			icon: '&#61886'
		}
	},

	render: function() {
		this.$el.html(_.template(template, this.data));
	}

});

export default = HeaderView;
