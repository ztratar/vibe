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

    		this.questions.on('reset', this.render, this);
    		this.questions.on('add', this.addOne, this);
    	},

    	render: function() {
    		this.$el.html('');
    		this.addQuestions();
    		return this;
    	},

    	addQuestions: function() {
    		this.questions.each(this.addOne, this);
    	},

    	addOne: function(question) {
    		var questionListItemView = new QuestionListItemView({
    				model: question,
    				button: this.button
    			});

    		this.$el.append(questionListItemView.$el);
    		questionListItemView.render();
    	}

    });

    __exports__["default"] = QuestionListView;
  });