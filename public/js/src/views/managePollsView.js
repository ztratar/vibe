import 'backbone';
import 'underscore';

import Question from 'models/question';
import Questions from 'models/questions';
import QuestionListView from 'views/questionListView';

module template from 'text!templates/managePollsView.html';

var ManagePollsView = Backbone.View.extend({

	className: 'manage-polls-view',

	template: _.template(template),

	events: {

	},

	initialize: function(opts) {
		var that = this;

		this.selectedQuestions = new Questions();
		this.suggestedQuestions = new Questions();

		this.selectedQuestions.url = '/api/questions';
		this.suggestedQuestions.url = '/api/questions/suggested';

		this.selectedQuestionsList = new QuestionListView({
			questions: this.selectedQuestions,
			button: {
				icon: '&#61943;',
				className: 'x-icon',
				click: function(model) {

				}
			}
		});
		this.suggestedQuestionsList = new QuestionListView({
			questions: this.suggestedQuestions,
			button: {
				icon: '&#61943;',
				click: function(model) {

				}
			}
		});
	},

	render: function() {
		this.$el.html(this.template());

		this.$('.selected-polls-container').html(this.selectedQuestionsList.$el);
		this.$('.suggested-polls-container').html(this.suggestedQuestionsList.$el);

		this.selectedQuestionsList.render();
		this.suggestedQuestionsList.render();

		this.selectedQuestions.fetch();
		this.suggestedQuestions.fetch();

		return this;
	}

});

export default = ManagePollsView;
