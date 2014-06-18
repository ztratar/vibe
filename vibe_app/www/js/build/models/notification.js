define("models/notification", 
  ["models/baseModel","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var BaseModel = __dependency1__["default"];

    var Notification = BaseModel.extend({

    	urlRoot: '/api/notifications',

    	defaults: {
    		time_created: new Date(),
    		time_updated: new Date(),
    		data: {},
    		read: false,
    		type: '',
    		img: ''
    	}

    });

    __exports__["default"] = Notification;
  });