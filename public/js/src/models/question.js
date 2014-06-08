import BaseModel from 'models/baseModel';

var Question = BaseModel.extend({

	urlRoot: '/api/questions',

	defaults: {
		_id: undefined,
		metaQuestion: undefined,
		body: '',
		active: true,
		from: {
			name: 'anonymous'
		},
		to: {
			name: 'everyone'
		},
		answer_data: {}
	},

	deselect: function() {
		this.set('active', false);
		return this.save();
	}

});

export default = Question;
