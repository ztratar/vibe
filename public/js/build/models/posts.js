define("models/posts", 
  ["backbone","models/post","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var Post = __dependency2__["default"];

    var Posts = Backbone.Collection.extend({

    	model: Post

    });

    __exports__["default"] = Posts;
  });