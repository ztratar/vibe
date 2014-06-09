define("views/managePollsView", 
  ["backbone","underscore","models/question","models/questions","views/questionListView","text!templates/managePollsView.html","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __dependency5__, __dependency6__, __exports__) {
    "use strict";

    var Question = __dependency3__["default"];
    var Questions = __dependency4__["default"];
    var QuestionListView = __dependency5__["default"];

    var template = __dependency6__;

    var ManagePollsView = Backbone.View.extend({

    	className: 'manage-polls-view',

    	template: _.template(template),

    	events: {

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

    				}
    			}
    		});
    		this.suggestedQuestionsList = new QuestionListView({
    			questions: this.suggestedQuestions,
    			button: {
    				icon: '&#61943;',
    				click: function(model) {

    				}
    			}
    		});
    	},

    	render: function() {
    		this.$el.html(this.template());

    		this.$('.selected-polls-container').html(this.selectedQuestionsList.$el);
    		this.$('.suggested-polls-container').html(this.suggestedQuestionsList.$el);

    		this.selectedQuestionsList.render();
    		this.suggestedQuestionsList.render();

    		this.selectedQuestions.fetch();
    		this.suggestedQuestions.fetch();

    		return this;
    	}

    });

    __exports__["default"] = ManagePollsView;
  });