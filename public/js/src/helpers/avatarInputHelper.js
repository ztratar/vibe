import 'jquery';

module loadImage from 'load-image';
import 'load-image-ios';
import 'load-image-orientation';
import 'load-image-meta';
import 'load-image-exif';
import 'load-image-exif-map';

var avatarInputHelper = function(fileInput, imgElem, textInput) {

	$(fileInput).change(function(){
		var that = this;

		loadImage.parseMetaData(
			this.files[0],
			function(data) {
				var orientation = data.exif ? data.exif.get('Orientation') : false;

				loadImage(
					that.files[0],
					function(canvas) {
						var dataURL = canvas.toDataURL("image/jpeg");
						$(imgElem).attr("src", dataURL);
						$(textInput).val(dataURL);
						$(fileInput).trigger('avatar-helper-done');
					},
					{
						cover: true,
						crop: true,
						maxWidth: 120,
						maxHeight: 120,
						minWidth: 120,
						minHeight: 120,
						orientation: orientation
					}
				);
			}
		);
	});
};

export default = avatarInputHelper;
