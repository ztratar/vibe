define("start-page", 
  [],
  function() {
    "use strict";
    require.config({
    	baseUrl: '/js/build',
    	paths: {
    		text: '../libs/text',
    		jquery: '../libs/jquery',
    		underscore: '../libs/underscore',
    		backbone: '../libs/backbone'
    	}
    });

    require(['pages/'+window.pageName]);
  });