define("models/chat", 
  ["models/baseModel","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var BaseModel = __dependency1__["default"];

    var Chat = BaseModel.extend({

    	urlRoot: window.Vibe.serverUrl + 'api/chats',

    	defaults: {
    		user: {},
    		body: '',
    		time_created: new Date(),
    		num_likes: 0,
    		current_user_liked: 0
    	}

    });

    __exports__["default"] = Chat;
  });