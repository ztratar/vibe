define("models/chatMessages", 
  ["backbone","models/chatMessage","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var ChatMessage = __dependency2__["default"];

    var ChatMessages = Backbone.Collection.extend({
    	model: ChatMessage
    });

    __exports__["default"] = ChatMessages;
  });