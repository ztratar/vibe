define("start", 
  [],
  function() {
    "use strict";
    require.config({
    	baseUrl: 'js/build',
    	paths: {
    		text: '../libs/text',
    		jquery: '../libs/jquery',
    		underscore: '../libs/underscore',
    		backbone: '../libs/backbone',
    		d3: '../libs/d3'
    	},
    	shim: {
    		d3: {
    			exports: 'd3'
    		}
    	}
    });

    require(['vibe']);
  });