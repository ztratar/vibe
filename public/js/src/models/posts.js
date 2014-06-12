import 'backbone';
import Post from 'models/post';

var Posts = Backbone.Collection.extend({

	model: Post

});

export default = Posts;
