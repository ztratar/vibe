import BaseModel from 'models/baseModel';

var Company = BaseModel.extend({

	urlRoot: window.Vibe.serverUrl + 'api/company',

	defaults: {
		name: '',
		cover: '',
		logo: ''
	},

	getImage: function(fieldName) {
		var fieldval = this.get(fieldName);

		if (fieldval.indexOf('data:image') !== -1) {
			return fieldval;
		}

		return window.Vibe.config.cloudfrontDomain + fieldval;
	}

});

export default = Company;
