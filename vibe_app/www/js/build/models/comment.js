define("models/comment", 
  ["models/baseModel","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var BaseModel = __dependency1__["default"];

    var ChatMessage = BaseModel.extend({
    	defaults: {
    		user: {
    			img: '',
    			name: ''
    		},
    		text: '',
    		timeCreated: new Date()
    	}
    });

    __exports__["default"] = ChatMessage;
  });