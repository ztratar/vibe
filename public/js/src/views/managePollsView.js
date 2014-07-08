import 'backbone';
import 'underscore';

import Question from 'models/question';
import Questions from 'models/questions';
import QuestionListView from 'views/questionListView';
import Analytics from 'helpers/analytics';

module template from 'text!templates/managePollsView.html';

var ManagePollsView = Backbone.View.extend({

	className: 'manage-polls-view',

	template: _.template(template),

	events: {
		'keydown form input': 'addPoll',
		'click form button': 'addPoll',
		'click a.close-modal': 'remove'
	},

	initialize: function(opts) {
		var that = this;

		this.selectedQuestions = new Questions();
		this.suggestedQuestions = new Questions();

		this.selectedQuestions.url = window.Vibe.serverUrl + 'api/questions';
		this.suggestedQuestions.url = window.Vibe.serverUrl + 'api/questions/suggested';

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

		this.selectedQuestions.on('all', this.determineSelectedListHeaderDisplay, this);
		this.suggestedQuestions.on('all', this.determineSuggestedListHeaderDisplay, this);
	},

	render: function() {
		var that = this;

		this.$el.html(this.template());

		this.$selectedHeader = this.$('.list-header.selected');
		this.$suggestedHeader = this.$('.list-header.suggested');

		this.$('.selected-polls-container').html(this.selectedQuestionsList.$el);
		this.$('.suggested-polls-container').html(this.suggestedQuestionsList.$el);

		this.selectedQuestionsList.render();
		this.suggestedQuestionsList.render();

		this.selectedQuestions.fetch();
		this.suggestedQuestions.fetch();

		this.$addPollInput = this.$('.add-poll input');

		_.delay(function() {
			that.$addPollInput.focus();
		}, 180);

		Analytics.log({
			eventCategory: 'question',
			eventAction: 'manage-section-loaded'
		});

		return this;
	},

	// Add poll is only triggered with keydown
	// and click, instead of submit, because of some
	// strange bug with the modal overlay. Forms wouldn't
	// trigger a submit action... not worth the time atm.
	addPoll: function(ev) {
		if (ev.type === 'keydown' && ev.keyCode !== 13) {
			return;
		}

		var that = this,
			pollText = this.$addPollInput.val(),
			question = new Question({
				body: pollText
			});

		if (!pollText.length) {
			return false;
		}

		Analytics.log({
			eventCategory: 'question',
			eventAction: 'adding-custom-poll'
		});

		question.save({}, {
			success: function(model, data) {
				if (data.error) {
					Analytics.log({
						eventCategory: 'question',
						eventAction: 'add-custom-poll-error',
						eventLabel: data.error
					});

					return;
				}
				that.$addPollInput.val('');
				that.$addPollInput.focus();
				that.selectedQuestions.add(model, { at: 0 });

				Analytics.log({
					eventCategory: 'question',
					eventAction: 'add-custom-poll-success'
				});
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
	},

	remove: function() {
		this.trigger('remove');
	}

});

export default = ManagePollsView;
