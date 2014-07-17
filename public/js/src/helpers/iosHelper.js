var iOSHelper = {

	detectVerticalSquash: function(img) {
		var iw = img.naturalWidth, ih = img.naturalHeight;
		var canvas = document.createElement('canvas');
		canvas.width = 1;
		canvas.height = ih;
		var ctx = canvas.getContext('2d');
		ctx.drawImage(img, 0, 0);
		var data = ctx.getImageData(0, 0, 1, ih).data;
		// search image edge pixel position in case it is squashed vertically.
		var sy = 0;
		var ey = ih;
		var py = ih;
		while (py > sy) {
			var alpha = data[(py - 1) * 4 + 3];
			if (alpha === 0) {
				ey = py;
			} else {
				sy = py;
			}
			py = (ey + sy) >> 1;
		}
		var ratio = (py / ih);
		return (ratio===0)?1:ratio;
	},

	drawImageIOSFix: function(ctx, img, sx, sy, sw, sh, dx, dy, dw, dh) {
		var vertSquashRatio = iOSHelper.detectVerticalSquash(img);
		ctx.drawImage(img, sx * vertSquashRatio, sy * vertSquashRatio,
						   sw * vertSquashRatio, sh * vertSquashRatio,
						   dx, dy, dw, dh );
	}

};

export default = iOSHelper;
