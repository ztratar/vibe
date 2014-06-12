import 'backbone';
import Feedback from 'models/feedback';

var Feedbacks = Backbone.Collection.extend({

	model: Feedback

});

export default = Feedbacks;
