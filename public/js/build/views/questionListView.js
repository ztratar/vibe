define("views/questionListView", 
  ["backbone","views/questionListItemView","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";

    var QuestionListItemView = __dependency2__["default"];

    var QuestionListView = Backbone.View.extend({

    	tagName: 'ul',

    	className: 'question-list-view',

    	initialize: function(opts) {
    		if (!opts || !opts.questions) return false;

    		this.questions = opts.questions;
    		this.button = opts.button;
    		this.question_type = opts.question_type;

    		this.questions.on('all', this.render, this);
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
    				model: question,
    				button: this.button,
    				question_type: this.question_type
    			});

    		if (this.questions.indexOf(question) === 0) {
    			this.$el.prepend(questionListItemView.$el);
    		} else {
    			this.$el.append(questionListItemView.$el);
    		}
    		questionListItemView.render();
    	}

    });

    __exports__["default"] = QuestionListView;
  });