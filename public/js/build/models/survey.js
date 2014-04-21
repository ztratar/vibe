define("models/survey", 
  ["models/baseModel","models/questions","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var BaseModel = __dependency1__["default"];
    var Questions = __dependency2__["default"];

    var Survey = BaseModel.extend({

    	defaults: {
    		_id: '03993029',
    		timeDue: (new Date()),
    		questions: []
    	},

    	initialize: function() {
    		this.on('change:questions', this.questionsToObjects);
    		this.set('questions', [{
    			title: 'Design Deliverables',
    			body: '<strong>Design Deliverables</strong> look...'			
    		}, {
    			title: 'Scrum Process',
    			body: 'The <strong>Scrum process</strong> is going...'	
    		}]);
    	},

    	// Turn question data into real Question Models
    	questionsToObjects: function() {
    		var questionData = this.get('questions'),
    			tempQuestions;
    		if (questionData.length) {
    			if (!(questionData instanceof Questions)) {
    				tempQuestions = new Questions(questionData);
    				this.set('questions', tempQuestions, {
    					silent: true	
    				});
    			}
    		}
    	}

    });

    __exports__["default"] = Survey;
  });