import BaseModel from 'models/baseModel';

var Post = BaseModel.extend({

	urlRoot: '/api/posts',

	defaults: {
		time_created: new Date(),
		for_user: undefined,
		content_type: undefined,
		content: undefined
	}

});

export default = Post;
