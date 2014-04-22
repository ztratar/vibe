import BaseModel from 'models/baseModel';

var MetaQuestion = BaseModel.extend({
	defaults: {
		_id: '_20398402938402834098',
		title: 'Team Productivity',
		body: '<strong>Team Productivity</strong> is going...',
		questionSelected: false
	},
	select: function() {
		this.set('questionSelected', true);
	},
	deselect: function() {
		this.set('questionSelected', false);
	}
});

export default = MetaQuestion;
