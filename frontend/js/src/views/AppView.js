import 'backbone';
import 'jquery';

import HeaderView from 'views/HeaderView';

module template from 'text!templates/AppView.html';

var AppView = Backbone.View.extend({
	el: 'body',
	className: 'vibe-app app-view',
	initialize: function() {
		this.headerView = new HeaderView();
	},
	render: function() {
		this.$el.html(template);
		this.$('.app-header').html(this.headerView.$el);
		this.headerView.render();
	}
});

export default = AppView;
