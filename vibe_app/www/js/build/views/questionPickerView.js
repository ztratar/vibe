define("views/questionPickerView", 
  ["backbone","models/metaQuestions","text!templates/questionPickerView.html","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __exports__) {
    "use strict";
    var MetaQuestions = __dependency2__["default"];

    var template = __dependency3__;

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
    		this.selectedQuestions = new MetaQuestions();

    		this.suggestedQuestions.on('all', this.render, this);
    		this.selectedQuestions.on('all', this.render, this);

    		this.suggestedQuestions.fetch({
    			url: '/api/meta_questions/suggested'
    		});
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
    			text = textField.val();

    		if (!(text && text.length)) {
    			return false;
    		}

    		this.selectedQuestions.add({
    			body: text
    		});

    		textField.val('').focus();

    		return false;
    	},
    	selectQuestion: function(ev) {
    		var target = $(ev.target),
    			questionId = target.attr('data-metaquestion-id'),
    			question = this.suggestedQuestions.get(questionId);

    		this.selectedQuestions.add(question, {
    			silent: true
    		});

    		this.suggestedQuestions.remove(question);

    		return false;
    	},
    	deselectQuestion: function(ev) {
    		var target = $(ev.target),
    			questionId = target.attr('data-metaquestion-id'),
    			question = this.selectedQuestions.get(questionId);

    		if (question.get('suggested')) {
    			this.suggestedQuestions.add(question, {
    				silent: true
    			});
    		}

    		this.selectedQuestions.remove(question);

    		return false;
    	}
    });

    __exports__["default"] = QuestionPickerView;
  });