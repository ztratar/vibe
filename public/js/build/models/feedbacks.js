define("models/feedbacks", 
  ["backbone","models/feedback","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var Feedback = __dependency2__["default"];

    var Feedbacks = Backbone.Collection.extend({

    	model: Feedback

    });

    __exports__["default"] = Feedbacks;
  });