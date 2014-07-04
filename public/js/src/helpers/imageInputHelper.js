import 'jquery';

var imageInputHelper = function(fileInput, imgElem, textInput, opts) {

	opts = opts || {};
	opts = _.extend({
		maxHeight: 200,
		maxWidth: 320
	}, opts);

	// Uses filereader, which is supported in most
	// modern browsers.
	$(fileInput).change(function(){
		if (this.files && this.files[0]) {
			var FR = new FileReader();

			FR.onload = function(e) {
				var tempImg = new Image();

				tempImg.src = e.target.result;
				tempImg.onload = function() {
					var tempW = tempImg.width;
					var tempH = tempImg.height;
					var tempRatio = tempW / tempH;
					var maxRatio = opts.maxWidth / opts.maxHeight;

					if (tempRatio > maxRatio) {
						// image is more width wise, which means width
						// will be the constraining factor
						if (tempW > opts.maxWidth) {
							tempW = opts.maxWidth;
							tempH = tempW / tempRatio;
						}
					} else {
						if (tempH > opts.maxHeight) {
							tempH = opts.maxHeight;
							tempW = tempH * tempRatio;
						}
					}

					var canvas = document.createElement('canvas');

					canvas.width = tempW;
					canvas.height = tempH;

					var ctx = canvas.getContext("2d");
					ctx.drawImage(this, 0, 0, tempImg.width, tempImg.height, 0, 0, tempW, tempH);

					var dataURL = canvas.toDataURL("image/png");
					$(imgElem).attr("src", dataURL);
					$(textInput).val(dataURL);
					$(fileInput).trigger('image-helper-done');
				};
			};
			FR.readAsDataURL(this.files[0]);
		}
	});
};

export default = imageInputHelper;
