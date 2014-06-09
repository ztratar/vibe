define("models/users", 
  ["backbone","models/user","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var User = __dependency2__["default"];

    var Users = Backbone.Collection.extend({

    	model: User

    });

    __exports__["default"] = Users;
  });