define("models/baseModel", 
  ["backbone","exports"],
  function(__dependency1__, __exports__) {
    "use strict";

    var BaseModel = Backbone.Model.extend({
    	idAttribute: '_id'
    });

    __exports__["default"] = BaseModel;
  });