define("views/homeView", 
  ["backbone","models/questions","views/chartsView","text!templates/homeView.html","text!templates/newChartsLocked.html","text!templates/surveySummaryCard.html","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __dependency5__, __dependency6__, __exports__) {
    "use strict";
    var Questions = __dependency2__["default"];
    var ChartsView = __dependency3__["default"];
    var template = __dependency4__;
    var newChartsLockedTemplate = __dependency5__;

    var surveySummaryCardTemplate = __dependency6__;

    var HomeView = Backbone.View.extend({
    	className: 'home-view',
    	template: _.template(template),
    	initialize: function() {
    		this.questions = new Questions();
    		this.chartsView = new ChartsView({
    			collection: this.questions	
    		});	
    		this.surveyTaken = false;
    	},
    	render: function() {
    		this.$el.html(this.template({
    			user: window.Vibe.user.toJSON()	
    		}));
    		this.$('.charts-container').html(this.chartsView.$el);
    		this.questions.reset([{}, {
    			body: 'Design Deliverables seem...',
    			answer_data: {
    				0: 3.7,
    				1: 3.2,
    				2: 3.6,
    				3: 4,
    				4: 4,
    				5: 0,
    				6: 0,
    				7: 2,
    				8: 1.8,
    				9: 2.7
    			}
    		}, {
    			body: 'Productivity is going...',
    			answer_data: {
    				0: 3.2,
    				1: 1.4,
    				2: 3.1,
    				3: 3.2,
    				4: 2.7,
    				5: 3.7,
    				6: 3,
    				7: 2.3,
    				8: 2.8,
    				9: 2
    			}
    		}, {
    			body: 'We focus on our goals...',
    			answer_data: {
    				0: 3.7,
    				1: 3.2,
    				2: 3.6,
    				3: 2.7,
    				4: 2.1,
    				5: 3.2,
    				6: 3.8,
    				7: 2,
    				8: 1.8,
    				9: 2.7
    			}
    		}, {
    			body: 'Vibe is going...',
    			answer_data: {
    				0: 4.0,
    				1: 3.8,
    				2: 3.7,
    				3: 3.6,
    				4: 3.5,
    				5: 3.4,
    				6: 3.2,
    				7: 2.8,
    				8: 3.0,
    				9: 3.1
    			}
    		}]);
    		if (!this.surveyTaken) {
    			this.chartsView.$el.prepend(_.template(surveySummaryCardTemplate, {
    				title: 'Last week',
    				response_times: {
    					best: '3 mins',
    					median: '7 hrs, 3 mins',
    					you: '3 days, 7 hrs'
    				},
    				completed: '87%',
    				numUsers: 24,
    				numCompleted: 21
    			}));
    			this.chartsView.$el.prepend(newChartsLockedTemplate);
    		} else {
    			this.chartsView.$el.prepend(_.template(surveySummaryCardTemplate, {
    				title: 'This week',
    				response_times: {
    					best: '1 mins',
    					median: 'Calculating...',
    					you: '1 hr, 50 mins'
    				},
    				completed: '8%',
    				numUsers: 24,
    				numCompleted: 2
    			}));
    		}

    		return this;
    	}
    });

    __exports__["default"] = HomeView;
  });