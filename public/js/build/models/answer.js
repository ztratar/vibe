define("models/answer", 
  ["models/baseModel","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var BaseModel = __dependency1__["default"];

    var Answer = BaseModel.extend({

    	urlRoot: function() {
    		return '/api/questions/' + this.get('question') + '/answers';
    	},

    	defaults: {
    		body: undefined,
    		time_created: new Date(),
    		question: undefined,
    		question_instance: undefined
    	}

    });

    __exports__["default"] = Answer;
  });