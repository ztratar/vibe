import 'backbone';
import Questions from 'models/questions';
import ChartsView from 'views/chartsView';
module template from 'text!templates/homeView.html';

var HomeView = Backbone.View.extend({
	className: 'home-view',
	template: _.template(template),
	initialize: function() {
		this.questions = new Questions();
		this.chartsView = new ChartsView({
			collection: this.questions	
		});	
	},
	render: function() {
		this.$el.html(this.template({
			user: window.Vibe.user.toJSON()	
		}));
		this.$('.charts-container').html(this.chartsView.$el);
		this.questions.add([{}, {
			title: 'Design Deliverables'	
		}, {
			title: 'Scrum Process'	
		}]);
		return this;
	}
});

export default = HomeView;
