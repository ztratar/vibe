define("models/feedback", 
  ["models/baseModel","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var BaseModel = __dependency1__["default"];

    var Feedback = BaseModel.extend({

    	urlRoot: '/api/feedback',

    	defaults: {
    		time_created: new Date(),
    		status: '',
    		body: '',
    		num_votes: 0
    	},

    	approve: function() {
    		this.save({
    			status: 'approved'
    		});
    	},

    	reject: function() {
    		this.save({
    			status: 'rejected'
    		});
    	}

    });

    __exports__["default"] = Feedback;
  });