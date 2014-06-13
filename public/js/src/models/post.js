import BaseModel from 'models/baseModel';
import Feedback from 'models/feedback';

var Post = BaseModel.extend({

	urlRoot: '/api/posts',

	defaults: {
		time_created: new Date(),
		for_user: undefined,
		content_type: undefined,
		feedback: undefined,
		question: undefined
	},

	initialize: function() {
		this.on('change:feedback', this.convertFeedback, this);
		this.convertFeedback();
	},

	convertFeedback: function() {
		if (this.get('feedback')
				&& !(this.get('feedback') instanceof Feedback)) {
			this.set('feedback', new Feedback(this.get('feedback')), {
				silent: true
			});
		}
	}

});

export default = Post;
