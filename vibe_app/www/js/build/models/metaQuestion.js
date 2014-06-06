define("models/metaQuestion", 
  ["models/baseModel","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var BaseModel = __dependency1__["default"];

    var MetaQuestion = BaseModel.extend({

    	urlRoot: '/api/meta_questions',

    	defaults: {
    		_id: '',
    		body: '',
    		questionSelected: false
    	}

    });

    __exports__["default"] = MetaQuestion;
  });