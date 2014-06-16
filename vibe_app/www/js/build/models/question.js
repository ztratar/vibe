define("models/question", 
  ["models/baseModel","models/answer","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var BaseModel = __dependency1__["default"];
    var Answer = __dependency2__["default"];

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
    		answer_data: []
    	},

    	deselect: function() {
    		this.set('active', false);
    		return this.save();
    	},

    	answer: function(answerBody) {
    		var newAnswer = new Answer({
    			body: answerBody,
    			question: this.get('_id')
    		});

    		//newAnswer.save();

    		this.trigger('newAnswer', answerBody);
    	}

    });

    __exports__["default"] = Question;
  });