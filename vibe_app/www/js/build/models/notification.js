define("models/notification", 
  ["models/baseModel","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var BaseModel = __dependency1__["default"];

    var Notification = BaseModel.extend({

    	urlRoot: '/api/notifications',

    	defaults: {
    		time_created: new Date(),
    		for_user: undefined,
    		img: undefined,
    		body: '',
    		link: ''
    	}

    });

    __exports__["default"] = Notification;
  });