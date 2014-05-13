import BaseModel from 'models/baseModel';
import Questions from 'models/questions';

var Survey = BaseModel.extend({

	defaults: {
		_id: '03993029',
		timeDue: (new Date()),
		questions: []
	},

	initialize: function() {
		this.on('change:questions', this.questionsToObjects);
		this.on('change:timeDue', this.timeToDateObject);
	},

	// Turn question data into real Question Models
	questionsToObjects: function() {
		var questionData = this.get('questions'),
			tempQuestions;

		if (questionData.length) {
			if (!(questionData instanceof Questions)) {
				tempQuestions = new Questions(questionData);
				this.set('questions', tempQuestions, {
					silent: true
				});
			}
		}
	},

	timeToDateObject: function() {
		var due = this.get('timeDue');

		if (typeof due === 'string') {
			this.set('timeDue', new Date(due), {
				silent: true
			});
		}
	},

	fetchNewSurvey: function(options) {
		var fetchOpts = _.extend({
				url: 'api/survey',
				data: {
					includeQuestions: true
				}
			}, options);

		return this.fetch(fetchOpts);
	}

});

export default = Survey;
