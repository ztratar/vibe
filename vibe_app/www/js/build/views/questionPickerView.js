define("views/questionPickerView", 
  ["backbone","models/question","models/questions","models/metaQuestions","text!templates/questionPickerView.html","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __dependency5__, __exports__) {
    "use strict";

    var Question = __dependency2__["default"];

    var Questions = __dependency3__["default"];
    var MetaQuestions = __dependency4__["default"];

    var template = __dependency5__;

    var QuestionPickerView = Backbone.View.extend({

    	className: 'question-picker',

    	template: _.template(template),

    	events: {
    		'click button.add-new': 'addQuestionFromText',
    		'click a.select': 'selectQuestion',
    		'click a.deselect': 'deselectQuestion'
    	},

    	initialize: function() {
    		this.suggestedQuestions = new MetaQuestions([{
    			body: 'Hey?',
    			suggested: true
    		}]);
    		this.selectedQuestions = new Questions();

    		this.suggestedQuestions.on('all', this.render, this);
    		this.selectedQuestions.on('all', this.render, this);

    		this.suggestedQuestions.fetchSuggested();
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
    			metaQuestion: questionId,
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
    				_id: question.get('metaQuestion'),
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

    __exports__["default"] = QuestionPickerView;
  });