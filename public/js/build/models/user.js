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
    		avatar: '/img/default_avatar.png',
    		company: {
    			name: ''
    		}
    	},

    	initialize: function(opts) {
    		if (opts.avatar === '') {
    			this.setAvatar();
    		}
    	},

    	setAvatar: function() {
    		if (this.get('avatar') === '') {
    			this.set('avatar', this.defaults.avatar, {
    				silent: true
    			});
    		}
    	}

    });

    __exports__["default"] = User;
  });