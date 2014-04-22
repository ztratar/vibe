define("models/metaQuestion", 
  ["models/baseModel","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var BaseModel = __dependency1__["default"];

    var MetaQuestion = BaseModel.extend({
    	defaults: {
    		_id: '_20398402938402834098',
    		title: 'Team Productivity',
    		body: '<strong>Team Productivity</strong> is going...',
    		questionSelected: false
    	},
    	select: function() {
    		this.set('questionSelected', true);
    	},
    	deselect: function() {
    		this.set('questionSelected', false);
    	}
    });

    __exports__["default"] = MetaQuestion;
  });