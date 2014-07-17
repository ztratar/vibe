import 'jquery';
import 'exifRestorer';
import iOSHelper from 'helpers/iosHelper';

var imageInputHelper = function(fileInput, imgElem, textInput, opts) {

	opts = opts || {};
	opts = _.extend({
		maxHeight: 200,
		maxWidth: 320,
		imageType: 'image/png'
	}, opts);

	var URL = window.URL || window.webkitURL;

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

					iOSHelper.drawImageIOSFix(ctx, this, 0, 0, tempImg.width, tempImg.height, 0, 0, tempW, tempH);

					var dataURL = canvas.toDataURL(opts.imageType);

					dataURL = ExifRestorer.restore(e.target.result, dataURL);
					if (dataURL.indexOf(opts.imageType) === -1) {
						dataURL = 'data:' + opts.imageType + ';base64,' + dataURL;
					}

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
