import BaseModel from 'models/baseModel';

var MetaQuestion = BaseModel.extend({

	urlRoot: window.Vibe.serverUrl + 'api/meta_questions',

	defaults: {
		_id: '',
		body: '',
		questionSelected: false
	}

});

export default = MetaQuestion;
