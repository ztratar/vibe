import 'backbone';

import Question from 'models/question';
import Questions from 'models/questions';

module template from 'text!templates/questionPickerView.html';

var QuestionPickerView = Backbone.View.extend({

	className: 'question-picker',

	template: _.template(template),

	events: {
		'click button.add-new': 'addQuestionFromText',
		'click a.select': 'selectQuestion',
		'click a.deselect': 'deselectQuestion'
	},

	initialize: function() {
		this.suggestedQuestions = new Questions();
		this.selectedQuestions = new Questions();

		this.selectedQuestions.url = window.Vibe.serverUrl + 'api/questions';
		this.suggestedQuestions.url = window.Vibe.serverUrl + 'api/questions/suggested';

		this.suggestedQuestions.on('all', this.render, this);
		this.selectedQuestions.on('all', this.render, this);

		this.selectedQuestionsList = new QuestionListView({
			questions: this.selectedQuestions,
			question_type: 'selected',
			button: {
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
			question_type: 'suggested',
			button: {
				icon: '&#61943;',
				click: function(model) {
					model.save();
					that.selectedQuestions.add(model);
					that.suggestedQuestions.remove(model);
				}
			}
		});

		this.suggestedQuestions.fetch();
	},

	render: function() {
		this.$el.html(this.template({
			suggestedQuestions: this.suggestedQuestions,
			selectedQuestions: this.selectedQuestions
		}));
		return this;
	},

	addQuestionFromText: function() {
		var textField = this.$('input[name="custom_question"]'),
			text = textField.val(),
			question;

		if (!(text && text.length)) {
			return false;
		}

		question = new Question({
			body: text
		});
		question.save();

		this.selectedQuestions.add(question);
		textField.val('').focus();

		return false;
	},

	selectQuestion: function(ev) {
		var target = $(ev.target),
			questionId = target.attr('data-metaquestion-id'),
			metaQuestion = this.suggestedQuestions.get(questionId),
			question;

		if (!questionId) {
			return false;
		}

		question = new Question({
			meta_question: questionId,
			suggested: true
		});
		question.save();

		this.selectedQuestions.add(question);
		this.suggestedQuestions.remove(metaQuestion);

		return false;
	},

	deselectQuestion: function(ev) {
		var target = $(ev.target),
			questionId = target.attr('data-question-id'),
			question = this.selectedQuestions.get(questionId);

		if (question.get('suggested')) {
			this.suggestedQuestions.add({
				_id: question.get('meta_question'),
				body: question.get('body')
			}, {
				silent: true
			});
		}
		this.selectedQuestions.remove(question);

		question.deselect();

		return false;
	}
});

export default = QuestionPickerView;
