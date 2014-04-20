define("models/question", 
  ["backbone","exports"],
  function(__dependency1__, __exports__) {
    "use strict";

    var Question = Backbone.Model.extend({
    	defaults: {
    		id: '_20398402938402834098',
    		title: 'Team Productivity',
    		ask: '<strong>Team Productivity</strong> is going...',
    		from: {
    			name: 'anonymous'
    		},
    		to: {
    			name: 'everyone'
    		},
    		questionType: 'happy_rating',
    		answerData: {
    			0: 3.4,
    			1: 3.4,
    			2: 2.4,
    			3: 3.4,
    			4: 1,
    			5: 2.3,
    			6: 1.6,
    			7: 1.6,
    			8: 1.2,
    			9: 2.3
    		}
    	}
    });

    __exports__["default"] = Question;
  });