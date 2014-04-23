import 'backbone';
import Comment from 'models/comment';

var Comments = Backbone.Collection.extend({
	model: Comment
});

export default = Comments;
