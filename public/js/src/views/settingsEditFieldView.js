import 'backbone';
import 'underscore';
import 'exifRestorer';
import iOSHelper from 'helpers/iosHelper';

import imageInputHelper from 'helpers/imageInputHelper';

module template from 'text!templates/settingsEditFieldView.html';

var URL = window.URL || window.webkitURL;

var SettingsEditFieldView = Backbone.View.extend({

	className: 'settings-edit-field-view',

	template: _.template(template),

	events: {
		'submit form': 'saveField'
	},

	initialize: function(opts) {
		_.extend(this, {
			model: undefined,
			title: '',
			attributeName: '',
			placeholder: '',
			askForCurrent: false,
			confirm: false,
			helperText: '',
			fieldType: 'text',
			maxHeight: undefined,
			maxWidth: undefined,
			imageType: 'image/png'
		}, opts);
	},

	render: function() {
		var currentValue = this.model.get(this.attributeName);
		if (this.fieldType === 'image' && typeof this.model.getImage === 'function') {
			currentValue = this.model.getImage(this.attributeName);
		}

		this.$el.html(this.template({
			title: this.title,
			attributeName: this.attributeName,
			confirm: this.confirm,
			askForCurrent: this.askForCurrent,
			placeholder: this.placeholder,
			helperText: this.helperText,
			fieldType: this.fieldType,
			currentValue: currentValue
		}));
		this.$form = this.$('.form');
		this.$error = this.$('.alert-danger');

		_.delay(_.bind(function() {
			this.$('input:eq(0)').focus();
		}, this), 400);

		if (this.fieldType === 'image') {
			imageInputHelper(
				this.$('input[name="form-img"]'),
				this.$('.form-img'),
				this.$('input[name="form-img_base64"]'),
				{
					maxHeight: this.maxHeight,
					maxWidth: this.maxWidth,
					imageType: this.imageType
				}
			);
		}

		return this;
	},

	saveField: function(cb) {
		var that = this,
			inputVal = this.getFieldInputValue(),
			saveObj = {};

		saveObj[this.attributeName] = inputVal;

		this.$error.html('').hide();

		if (!inputVal) {
			this.$error.html('This can\'t be blank').show();
			return false;
		}

		if (this.confirm && (inputVal !== this.getConfirmFieldInputValue())) {
			this.$error.html('Fields don\'t match').show();
			return false;
		}

		if (this.askForCurrent) {
			if (!this.getCurrentFieldInputValue()) {
				this.$error.html('Enter your current' + this.title).show();
				return false;
			}

			saveObj[this.attributeName + '_current'] = this.getCurrentFieldInputValue();
		}

		this.setLoading(true);

		this.model.save(saveObj, {
			success: function(model, data) {
				if (data.error) {
					that.setLoading(false);
					that.$error.html(data.error).show();
					return false;
				}
				if (that.attributeName === 'password') {
					// Set password to undefined
					// to future PUT operations don't
					// mistkanly try and set a new one
					model.set('password', undefined, {
						silent: true
					});
				}
				if (cb && typeof cb === 'function') {
					cb(model, data);
				}
				window.Vibe.appRouter.navigateWithAnimation('/settings', 'pushRight', {
					trigger: true
				});
			}
		});

		return false;
	},

	getFieldInputValue: function() {
		if (this.fieldType === 'image') {
			return this.$('input[name="form-img_base64"]').val();
		} else {
			return this.$('input[name="'+this.attributeName+'"]').val();
		}
	},

	getConfirmFieldInputValue: function() {
		return this.$('input[name="'+this.attributeName+'_confirm"]').val();
	},

	getCurrentFieldInputValue: function() {
		return this.$('input[name="'+this.attributeName+'_current"]').val();
	},

	setLoading: function(setToLoading) {
		if (setToLoading) {
			this.$('input').prop('disabled', true);
			this.$form.addClass('loading');
		} else {
			this.$('input').prop('disabled', false);
			this.$form.removeClass('loading');
		}
	},

	uploadPic: function(ev) {
		var that = this;

		console.log('upload pic triggered');

		if (window.isCordova) {
			ev.stopPropagation();
			ev.preventDefault();

			window.navigator.camera.getPicture(function(data) {
				var img = new Image();
				img.src = data;
				img.onload = function() {
					var tempW = img.width;
					var tempH = img.height;
					var tempRatio = tempW / tempH;
					var maxRatio = that.maxWidth / that.maxHeight;

					if (tempRatio > maxRatio) {
						// image is more width wise, which means width
						// will be the constraining factor
						if (tempW > that.maxWidth) {
							tempW = that.maxWidth;
							tempH = tempW / tempRatio;
						}
					} else {
						if (tempH > that.maxHeight) {
							tempH = that.maxHeight;
							tempW = tempH * tempRatio;
						}
					}

					var canvas = document.createElement('canvas');

					canvas.width = tempW;
					canvas.height = tempH;

					var ctx = canvas.getContext("2d");

					console.log({
						imgWidth: img.width,
						imgHeight: img.height,
						tempW: tempW,
						tempH: tempH
					});

					console.log('about to draw', this.src.length, this.src.slice(0, 40));

					iOSHelper.drawImageIOSFix(ctx, this, 0, 0, img.width, img.height, 0, 0, tempW, tempH);

					var dataURL = canvas.toDataURL(that.imageType);

					console.log('before', dataURL.length, dataURL.slice(0, 40));
					dataURL = ExifRestorer.restore(img.src, dataURL);

					if (dataURL.indexOf(that.imageType) === -1) {
						dataURL = 'data:' + that.imageType + ';base64,' + dataURL;
					}
					console.log('after', dataURL.length, dataURL.slice(0, 40));
					that.$('.form-img').attr("src", dataURL);
					that.$('input[name="form-img_base64"]').val(dataURL);
				};
			}, function(err) {
				console.log('err :(');
			}, {
				targetWidth: that.maxWidth,
				destinationType: 1
			});

			return false;
		}
	}

});

export default = SettingsEditFieldView;
