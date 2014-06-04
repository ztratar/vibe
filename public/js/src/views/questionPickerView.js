import 'backbone';
module template from 'text!templates/questionPickerView.html';

var QuestionPickerView = Backbone.View.extend({
	className: 'question-picker',
	template: _.template(template),
	render: function() {
		this.$el.html(this.template());
		return this;
	}
});

export default = QuestionPickerView;
