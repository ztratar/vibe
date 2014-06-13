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
		'submit form': 'addPoll'
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
					model.save({
						active: false
					});
					if (model.get('suggested')) {
						that.suggestedQuestions.add(model);
					}
					that.selectedQuestions.remove(model);
				}
			}
		});
		this.suggestedQuestionsList = new QuestionListView({
			questions: this.suggestedQuestions,
			button: {
				icon: '&#61943;',
				click: function(model) {
					model.save();
					that.selectedQuestions.add(model);
					that.suggestedQuestions.remove(model);
				}
			}
		});

		this.selectedQuestions.on('all', this.determineSelectedListHeaderDisplay, this);
		this.suggestedQuestions.on('all', this.determineSuggestedListHeaderDisplay, this);
	},

	render: function() {
		this.$el.html(this.template());

		this.$selectedHeader = this.$('.list-header.selected');
		this.$suggestedHeader = this.$('.list-header.suggested');

		this.$('.selected-polls-container').html(this.selectedQuestionsList.$el);
		this.$('.suggested-polls-container').html(this.suggestedQuestionsList.$el);

		this.selectedQuestionsList.render();
		this.suggestedQuestionsList.render();

		this.selectedQuestions.fetch();
		this.suggestedQuestions.fetch();

		return this;
	},

	addPoll: function() {
		var that = this,
			$input = this.$('.add-poll input'),
			pollText = $input.val(),
			question = new Question({
				body: pollText
			});

		if (!pollText.length) {
			return false;
		}

		question.save({}, {
			success: function(model, data) {
				if (data.error) {
					return;
				}
				$input.val('');
				$input.focus();
				that.selectedQuestions.add(model);
			}
		});

		return false;
	},

	determineSuggestedListHeaderDisplay: function() {
		if (!this.suggestedQuestions.length) {
			this.$suggestedHeader.hide();
		} else {
			this.$suggestedHeader.show();
		}
	},

	determineSelectedListHeaderDisplay: function() {
		if (!this.selectedQuestions.length) {
			this.$selectedHeader.hide();
		} else {
			this.$selectedHeader.show();
		}
	}

});

export default = ManagePollsView;