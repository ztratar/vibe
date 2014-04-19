import 'backbone';

var Question = Backbone.Model.extend({
	defaults: {
		id: '_20398402938402834098',
		title: 'Team Productivity',
		ask: '<strong>Team Productivity</strong> is going...',
		from: {
			name: 'anonymous'
		},
		to: {
			name: 'everyone'
		},
		questionType: 'happy_rating',
		answerData: {
			0: 4.0,
			1: 3.6,
			2: 3.8,
			4: 2.7,
			5: 3.1,
			6: 3.2,
			7: 3.6
		}
	}
});

export default = Question;
