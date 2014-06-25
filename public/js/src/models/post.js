import BaseModel from 'models/baseModel';
import Feedback from 'models/feedback';
import Question from 'models/question';

var Post = BaseModel.extend({

	urlRoot: window.Vibe.serverUrl + 'api/posts',

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

		this.on('change:question', this.convertQuestion, this);
		this.convertQuestion();
	},

	convertFeedback: function() {
		if (this.get('feedback')
				&& !(this.get('feedback') instanceof Feedback)) {
			this.set('feedback', new Feedback(this.get('feedback')), {
				silent: true
			});
		}
	},

	convertQuestion: function() {
		if (this.get('question')
				&& !(this.get('question') instanceof Question)) {
			this.set('question', new Question(this.get('question')), {
				silent: true
			});
		}
	}

});

export default = Post;
