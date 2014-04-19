import 'backbone';
import ChartsView from 'views/chartsView';
module template from 'text!templates/homeView.html';

var HomeView = Backbone.View.extend({
	className: 'home-view',
	template: _.template(template),
	initialize: function() {
		this.chartsView = new ChartsView();	
	},
	render: function() {
		this.$el.html(this.template({
			user: window.Vibe.user.toJSON()	
		}));
		this.$('.charts-container').html(this.chartsView.$el);
		this.chartsView.render();
		return this;
	}
});

export default = HomeView;
