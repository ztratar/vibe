import 'backbone';
import Question from 'models/question';

var Questions = Backbone.Collection.extend({

	model: Question

});

export default = Questions;
