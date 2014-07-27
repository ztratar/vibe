define("models/metaQuestions", 
  ["backbone","models/metaQuestion","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var MetaQuestion = __dependency2__["default"];

    var MetaQuestions = Backbone.Collection.extend({

    	model: MetaQuestion,

    	fetchSuggested: function(opts) {
    		opts = opts || {};

    		_.extend(opts, {
    			url: '/api/meta_questions/suggested'
    		});
    		this.fetch(opts);
    	}

    });

    __exports__["default"] = MetaQuestions;
  });