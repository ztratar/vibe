define("models/chatMessage", 
  ["models/baseModel","models/user","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var BaseModel = __dependency1__["default"];
    var User = __dependency2__["default"];

    var ChatMessage = BaseModel.extend({

    	defaults: {
    		user: {},
    		text: '',
    		timeCreated: new Date()
    	},

    	initialize: function() {
    		this.on('change:user', this.userToModel);
    		this.userToModel();
    	},

    	userToModel: function() {
    		var userData = this.get('user'),
    			tempUser;

    		if (userData) {
    			if (!(userData instanceof User)) {
    				tempUser = new User(userData);
    				this.set('user', tempUser, {
    					silent: true	
    				});
    			}
    		}
    	}

    });

    __exports__["default"] = ChatMessage;
  });