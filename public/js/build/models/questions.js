define("models/questions", 
  ["backbone","models/question","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var Question = __dependency2__["default"];

    var Questions = Backbone.Collection.extend({

    	model: Question

    });

    __exports__["default"] = Questions;
  });