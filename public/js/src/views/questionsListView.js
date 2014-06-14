import 'backbone';

import QuestionListItemView from 'views/questionListItemView';

var QuestionListView = Backbone.View.extend({

	tagName: 'ul',

	className: 'question-list-view',

	initialize: function(opts) {
		if (!opts || !opts.questions) return false;
	},

	render: function() {
		this.addQuestions();
		return this;
	},

	addQuestions: function() {
		this.$el.html('');
		this.questions.each(this.addOne, this);
	},

	addOne: function(question) {
		var questionListItemView = new QuestionListItemView({
				model: question
			});

		this.$el.append(questionListItemView.$el);
		questionListItemView.render();
	}

});

export default = QuestionListView;
