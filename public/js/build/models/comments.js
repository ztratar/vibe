define("models/comments", 
  ["backbone","models/comment","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var Comment = __dependency2__["default"];

    var Comments = Backbone.Collection.extend({
    	model: Comment
    });

    __exports__["default"] = Comments;
  });