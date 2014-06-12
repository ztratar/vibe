define("models/post", 
  ["models/baseModel","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var BaseModel = __dependency1__["default"];

    var Post = BaseModel.extend({

    	urlRoot: '/api/posts',

    	defaults: {
    		time_created: new Date(),
    		for_user: undefined,
    		content_type: undefined,
    		feedback: undefined,
    		question: undefined
    	}

    });

    __exports__["default"] = Post;
  });