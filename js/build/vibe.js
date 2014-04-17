define("vibe", 
  ["jquery","underscore","backbone","router","views/AppView"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __dependency5__) {
    "use strict";
    // Import libs

    var Router = __dependency4__["default"];
    var AppView = __dependency5__["default"];

    window.Vibe = window.Vibe || {};

    $(function() {
    	window.Vibe.appView = new AppView();
    	window.Vibe.appView.render();

    	Router.init();
    });
  });