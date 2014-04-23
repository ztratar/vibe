define("views/settingsView", 
  ["backbone","underscore","models/metaQuestions","views/metaQuestionSelectView","text!templates/settingsView.html","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __dependency5__, __exports__) {
    "use strict";

    var MetaQuestions = __dependency3__["default"];
    var MetaQuestionSelectView = __dependency4__["default"];

    var template = __dependency5__;

    var SettingsView = Backbone.View.extend({

    	className: 'settings-view',

    	template: _.template(template),

    	events: {
    		'click a.trigger-survey': 'triggerSurvey'
    	},

    	initialize: function() {
    		this.metaQuestions = new MetaQuestions([{
    			title: 'Scrum Process'	
    		}, {
    			questionSelected: true	
    		}, {
    			title: 'Design Deliverables'	
    		}]);
    		this.metaQuestions.on('add', this.addOne, this);
    		this.metaQuestions.on('reset', this.addAll, this);
    	},

    	render: function() {
    		this.$el.html(this.template());
    		this.$metaContainer = this.$('.metaquestions');
    		this.addAll();
    		return this;
    	},

    	addOne: function(metaQuestion) {
    		var metaQuestionView = new MetaQuestionSelectView({
    			model: metaQuestion	
    		});	
    		this.$metaContainer.append(metaQuestionView.$el);
    		metaQuestionView.render();
    	},

    	addAll: function() {
    		this.$metaContainer.empty();
    		this.metaQuestions.each(_.bind(this.addOne, this));
    	},

    	triggerSurvey: function() {
    		_.delay(function() {
    			window.Vibe.appView.checkForNewSurvey();
    		}, 2800);
    		return false;
    	}

    });

    __exports__["default"] = SettingsView;
  });