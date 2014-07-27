define("models/notification", 
  ["models/baseModel","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var BaseModel = __dependency1__["default"];

    var Notification = BaseModel.extend({

    	urlRoot: window.Vibe.serverUrl + 'api/notifications',

    	defaults: {
    		time_created: new Date(),
    		time_updated: new Date(),
    		data: {},
    		read: false,
    		type: '',
    		img: ''
    	},

    	getActionUrl: function() {
    		switch (this.get('type')) {
    			case 'question':
    			case 'question-vote':
    				return 'question/' + this.get('data').questionId;
    			case 'question-chat':
    				return 'question/' + this.get('data').questionId + '/chat';
    			case 'feedback-agree':
    				return 'feedback/' + this.get('data').feedbackId;
    			case 'feedback-chat':
    				return 'feedback/' + this.get('data').feedbackId + '/chat';
    			default:
    				return false;
    		}
    	}

    });

    __exports__["default"] = Notification;
  });