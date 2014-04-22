define("views/surveyView", 
  ["backbone","text!templates/surveyView.html","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";

    var template = __dependency2__;

    var SurveyView = Backbone.View.extend({
    	template: _.template(template),
    	className: 'survey-view',
    	events: {
    		'touchstart ul.answers a': 'answerQuestion',
    		'click ul.answers a': 'answerQuestion'
    	},
    	initialize: function() {
    		this.activeQuestion = 1;
    		$(window).on('resize', _.throttle(_.bind(this.setAnswerHeight, this), 16));
    	},
    	render: function() {
    		this.$el.html(this.template({
    			questions: this.model.get('questions'),
    			activeQuestionCounter: this.activeQuestion
    		}));

    		_.defer(_.bind(function() {
    			this.setAnswerHeight();
    		}, this));

    		return this;
    	},
    	setAnswerHeight: function() {
    		var $answers = this.$('.answers'),
    			screenOffset = this.$el.offset().top,
    			answerTopOffset = $answers.offset().top - screenOffset,
    			windowHeight = $(window).height(),
    			marginExists = 26,
    			answerHeight = windowHeight - answerTopOffset - marginExists;

    		this.$('.answers').height(answerHeight);
    	},
    	answerQuestion: function(ev) {
    		var $target = $(ev.currentTarget);

    		$target.addClass('selected');

    		this.nextQuestion();

    		return false;
    	},
    	nextQuestion: function() {
    		if (this.activeQuestion >= this.model.get('questions').length) {
    			_.delay(_.bind(function() {
    				this.surveyDone();
    			}, this), 320);

    			return;
    		}

    		var $questionElems = this.$('.q'+this.activeQuestion),
    			$nextQuestionBar = this.$('.participants-bar.q'+(this.activeQuestion+1)),
    			$nextQuestion = this.$('.question.q'+(this.activeQuestion+1)),
    			$step = $('ul.steps li.active');	

    		this.activeQuestion++;

    		$step.removeClass('active');
    		$step.next().addClass('active');

    		_.delay(function() {
    			$questionElems.addClass('answered').removeClass('show showNow');
    		}, 270);
    		_.delay(function() {
    			$nextQuestionBar.addClass('show');
    		}, 600);
    		_.delay(function() {
    			$nextQuestion.addClass('show');
    		}, 880);
    	},
    	surveyDone: function() {
    		window.Vibe.appRouter.navigateWithAnimation('/surveyDone', 'slideDown', {
    			trigger: true
    		});	
    	}
    });

    __exports__["default"] = SurveyView;
  });