define("helpers/avatarInputHelper", 
  ["jquery","exports"],
  function(__dependency1__, __exports__) {
    "use strict";

    var avatarInputHelper = function(fileInput, imgElem, textInput) {
    	// Uses filereader, which is supported in most
    	// modern browsers.
    	$(fileInput).change(function(){
    		if (this.files && this.files[0]) {
    			var FR = new FileReader();

    			FR.onload = function(e) {
    				var tempImg = new Image();

    				tempImg.src = e.target.result;
    				tempImg.onload = function() {
    					var SQUARE_WIDTH = 120;
    					var tempW = tempImg.width;
    					var tempH = tempImg.height;
    					var startX = 0;
    					var startY = 0;

    					if (tempW > tempH) {
    						tempW = tempH;
    						//tempW *= SQUARE_WIDTH / tempH;

    						startX = (tempImg.width - tempImg.height) / 2;
    					} else {
    						tempH = tempW;
    						//tempW = SQUARE_WIDTH;
    						//tempH *= SQUARE_WIDTH / tempW;

    						startY = (tempImg.height - tempImg.width) / 2;
    					}

    					var canvas = document.createElement('canvas');
    					canvas.width = tempW;
    					canvas.height = tempH;

    					var ctx = canvas.getContext("2d");
    					ctx.drawImage(this, startX, startY, tempW, tempH, 0, 0, tempW, tempH);
    					ctx.scale(SQUARE_WIDTH / tempW, SQUARE_WIDTH / tempH);
    					canvas.width = SQUARE_WIDTH;
    					canvas.height = SQUARE_WIDTH;

    					var dataURL = canvas.toDataURL("image/jpeg");
    					$(imgElem).attr("src", dataURL);
    					$(textInput).val(dataURL);
    					$(fileInput).trigger('avatar-helper-done');
    				};
    			};
    			FR.readAsDataURL(this.files[0]);
    		}
    	});
    };

    __exports__["default"] = avatarInputHelper;
  });