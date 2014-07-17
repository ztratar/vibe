import 'jquery';
import 'exifRestorer';
import iOSHelper from 'helpers/iosHelper';

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
						startX = (tempImg.width - tempImg.height) / 2;
					} else {
						tempH = tempW;
						startY = (tempImg.height - tempImg.width) / 2;
					}

					var canvas = document.createElement('canvas');

					canvas.width = SQUARE_WIDTH;
					canvas.height = SQUARE_WIDTH;

					var ctx = canvas.getContext("2d");

					iOSHelper.drawImageIOSFix(ctx, this, startX, startY, tempW, tempH, 0, 0, SQUARE_WIDTH, SQUARE_WIDTH);

					var dataURL = canvas.toDataURL("image/jpeg");

					dataURL = ExifRestorer.restore(e.target.result, dataURL);
					dataURL = 'data:image/jpeg;base64,' + dataURL;

					$(imgElem).attr("src", dataURL);
					$(textInput).val(dataURL);
					$(fileInput).trigger('avatar-helper-done');
				};
			};
			FR.readAsDataURL(this.files[0]);
		}
	});
};

export default = avatarInputHelper;
