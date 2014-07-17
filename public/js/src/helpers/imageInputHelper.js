import 'jquery';

module loadImage from 'load-image';
import 'load-image-ios';
import 'load-image-orientation';
import 'load-image-meta';
import 'load-image-exif';
import 'load-image-exif-map';

var imageInputHelper = function(fileInput, imgElem, textInput, opts) {
	opts = opts || {};
	opts = _.extend({
		maxHeight: 200,
		maxWidth: 320,
		imageType: 'image/png'
	}, opts);

	$(fileInput).change(function(){
		var that = this;

		loadImage.parseMetaData(
			this.files[0],
			function(data) {
				var orientation = data.exif ? data.exif.get('Orientation') : false;

				loadImage(
					that.files[0],
					function(canvas) {
						var dataURL = canvas.toDataURL(opts.imageType);
						$(imgElem).attr("src", dataURL);
						$(textInput).val(dataURL);
						$(fileInput).trigger('avatar-helper-done');
					},
					{
						contain: true,
						maxWidth: opts.maxWidth,
						maxHeight: opts.maxHeight,
						orientation: orientation
					}
				);
			}
		);
	});
};

export default = imageInputHelper;
