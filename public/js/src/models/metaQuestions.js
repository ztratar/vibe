import 'backbone';
import MetaQuestion from 'models/metaQuestion';

var MetaQuestions = Backbone.Collection.extend({
	model: MetaQuestion
});

export default = MetaQuestions;
