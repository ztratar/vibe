import 'backbone';

module template from 'text!templates/surveyView.html';

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
			this.$('.question.q1').addClass('show');
		}, this));

		return this;
	},
	setAnswerHeight: function() {
		var $answers = this.$('.q' + this.activeQuestion + ' .answers'),
			$header = this.$('.q' + this.activeQuestion + ' h2'),
			headerHeight = $header.height(),
			screenOffset = this.$el.offset().top,
			answerTopOffset = $answers.offset().top - screenOffset,
			windowHeight = $(window).height(),
			marginExists = 26,
			answerHeight = windowHeight - headerHeight - 180;

		var translateString = 'translate3d(0, ' + Math.floor((answerHeight/2) + (headerHeight/2)) + 'px, 0)';
		$header.css('transform', translateString);
		$header.css('-webkit-transform', translateString);
		this.$('.answers').height(answerHeight);

		_.delay(function() {
			var translateString = 'translate3d(0, 20px, 0)';
			$header.css('transform', translateString);
			$header.css('-webkit-transform', translateString);
		}, 1800);
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

		var that = this,
			$questionElems = this.$('.q'+this.activeQuestion),
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
			that.setAnswerHeight();
			_.delay(function() {
				$nextQuestion.addClass('show');
			}, 10);
		}, 880);
	},
	surveyDone: function() {
		window.Vibe.appRouter.navigateWithAnimation('/surveyDone', 'slideDown', {
			trigger: true
		});	
	}
});

export default = SurveyView;
