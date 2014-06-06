import 'backbone';
import MetaQuestion from 'models/metaQuestion';

var MetaQuestions = Backbone.Collection.extend({

	model: MetaQuestion,

	fetchSuggested: function(opts) {
		opts = opts || {};

		_.extend(opts, {
			url: '/api/meta_questions/suggested'
		});
		this.fetch(opts);
	}

});

export default = MetaQuestions;
