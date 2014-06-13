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
    		num_votes: 0,
    		current_user_agreed: false
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
    	},

    	agree: function() {
    		var currentVotes = this.get('num_votes');

    		this.set({
    			'current_user_agreed': true,
    			'num_votes': currentVotes+1
    		});

    		this.save({}, {
    			url: this.url() + '/agree'
    		});
    	},

    	undoAgree: function() {
    		var currentVotes = this.get('num_votes');

    		this.set({
    			'current_user_agreed': false,
    			'num_votes': currentVotes-1
    		});

    		this.save({}, {
    			url: this.url() + '/undo_agree'
    		});
    	},

    	pullDown: function() {
    		this.destroy();
    	}

    });

    __exports__["default"] = Feedback;
  });