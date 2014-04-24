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
		this.set('questions', [{
			title: 'Design Deliverables',
			body: '<strong>Design Deliverables</strong> look...'			
		}, {
			title: 'Goal Breakdown',
			body: 'We break down our <strong>goals</strong> into <strong>tasks</strong>...'	
		}, {
			title: 'Productivity',
			body: '<strong>Productivity</strong> is going...'
		}, {
			title: 'Focus On Goals',
			body: 'We <strong>focus</strong> on our <strong>goals</strong>...'
		}, {
			title: 'Vibe',
			body: '<strong>Vibe</strong> is going...'
		}]);
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
	}

});

export default = Survey;
