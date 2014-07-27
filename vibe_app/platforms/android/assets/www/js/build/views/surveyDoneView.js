define("views/surveyDoneView", 
  ["backbone","text!templates/surveyDoneView.html","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var template = __dependency2__;

    var SurveyDoneView = Backbone.View.extend({

    	template: _.template(template),

    	events: {
    		'click a.back': 'clickBack'
    	},

    	render: function() {
    		this.$el.html(this.template());
    		return this;
    	},

    	clickBack: function() {
    		window.Vibe.appRouter.navigateWithAnimation('/', 'pushRight', {
    			trigger: true
    		});	

    		return false;
    	}

    });

    __exports__["default"] = SurveyDoneView;
  });