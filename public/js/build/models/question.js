define("models/question", 
  ["models/baseModel","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var BaseModel = __dependency1__["default"];

    var Question = BaseModel.extend({

    	urlRoot: '/api/questions',

    	defaults: {
    		_id: undefined,
    		meta_question: undefined,
    		body: '',
    		active: true,
    		send_on_days: [0, 0, 0, 0, 0],
    		from: {
    			name: 'anonymous'
    		},
    		to: {
    			name: 'everyone'
    		},
    		answer_data: {}
    	},

    	deselect: function() {
    		this.set('active', false);
    		return this.save();
    	}

    });

    __exports__["default"] = Question;
  });