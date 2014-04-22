import BaseModel from 'models/baseModel';

var Comment = BaseModel.extend({
	defaults: {
		user: {
			img: '',
			name: ''
		},
		text: '',
		timeCreated: new Date()
	}
});

export default = Comment;
