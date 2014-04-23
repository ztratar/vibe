define("views/AppView", 
  ["backbone","jquery","models/survey","views/headerView","text!templates/AppView.html","text!templates/surveyNotification.html","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __dependency5__, __dependency6__, __exports__) {
    "use strict";
    var Survey = __dependency3__["default"];
    var HeaderView = __dependency4__["default"];
    var template = __dependency5__;
    var surveyTemplate = __dependency6__;

    var AppView = Backbone.View.extend({

    	el: 'body',

    	className: 'vibe-app app-view',

    	initialize: function() {
    		this.headerView = new HeaderView();
    		this.overrideLinks();
    	},

    	render: function() {
    		this.$el.html(template);
    		this.$('.app-header').html(this.headerView.$el);
    	},

    	overrideLinks: function() {
    		this.$el.on('click', 'a', function(ev) {
    			var $target = $(ev.target),
    				href= $target.attr('href'),
    				animation = $target.attr('data-animation');

    			if (!$target.hasClass('no-override') && href && href.charAt(0) === '/') {
    				window.Vibe.appRouter.navigateWithAnimation(href, animation, {
    					trigger: true	
    				});
    				return false;
    			}
    		});
    	},

    	checkForNewSurvey: function() {
    		var surveyData = {};
    		// Check for survey
    		if (surveyData) {
    			// If survey is found, render the notification and
    			// cache the data.
    			this.survey = new Survey(surveyData);
    			window.Vibe.modelCache.set('survey-' + this.survey.get('_id'), this.survey.toJSON());	
    			this.renderAndShowSurveyNotification();
    		}
    	},

    	renderAndShowSurveyNotification: function() {
    		var msTimeDiff = (new Date()).getTime() - this.survey.get('timeDue').getTime(),
    			daysTime = Math.floor(msTimeDiff / (1000 * 60 * 60 * 24)),
    			dueString = 'Take Survey - Due in ' + daysTime + ' days';

    		if (daysTime === 0) {
    			dueString = 'Take Survey - Due Now!';	
    		}

    		this.$('.survey-notif').html(_.template(surveyTemplate, {
    			dueString: dueString	
    		}));

    		this.$el.addClass('survey-show');

    		this.$('.survey-notif').off('click touchstart').on('click touchstart', _.bind(function() {
    			window.Vibe.appRouter.navigateWithAnimation('/survey/03993029', 'slideUp', {
    				trigger: true,
    				screenSize: 'full'
    			});	
    			this.$el.removeClass('survey-show');

    			return false;
    		}, this));
    	}

    });

    __exports__["default"] = AppView;
  });