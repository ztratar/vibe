import 'backbone';
module template from 'text!templates/surveyDoneView.html';

var SurveyDoneView = Backbone.View.extend({

	template: _.template(template),

	events: {
		'click a.back': 'clickBack'
	},

	render: function() {
		this.$el.html(this.template());
		return this;
	},

	clickBack: function() {
		window.Vibe.appRouter.navigateWithAnimation('/', 'pushRight', {
			trigger: true
		});	

		return false;
	}

});

export default = SurveyDoneView;
