define("start-page", 
  [],
  function() {
    "use strict";
    require.config({
    	baseUrl: 'js/build',
    	paths: {
    		jquery: '../libs/jquery',
    		underscore: '../libs/underscore'
    	},
    	shim: {
    		d3: {
    			exports: 'd3'
    		}
    	}
    });

    require(['pages/'+window.pageName]);
  });