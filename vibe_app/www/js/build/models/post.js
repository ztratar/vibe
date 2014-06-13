define("models/post", 
  ["models/baseModel","models/feedback","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var BaseModel = __dependency1__["default"];
    var Feedback = __dependency2__["default"];

    var Post = BaseModel.extend({

    	urlRoot: '/api/posts',

    	defaults: {
    		time_created: new Date(),
    		for_user: undefined,
    		content_type: undefined,
    		feedback: undefined,
    		question: undefined
    	},

    	initialize: function() {
    		this.on('change:feedback', this.convertFeedback, this);
    		this.convertFeedback();
    	},

    	convertFeedback: function() {
    		if (this.get('feedback')
    				&& !(this.get('feedback') instanceof Feedback)) {
    			this.set('feedback', new Feedback(this.get('feedback')), {
    				silent: true
    			});
    		}
    	}

    });

    __exports__["default"] = Post;
  });