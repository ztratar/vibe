define("models/user", 
  ["models/baseModel","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var BaseModel = __dependency1__["default"];

    var User = BaseModel.extend({

    	urlRoot: '/api/users',

    	defaults: {
    		name: '',
    		email: '',
    		avatar: '/img/default_avatar.png'
    	}

    });

    __exports__["default"] = User;
  });