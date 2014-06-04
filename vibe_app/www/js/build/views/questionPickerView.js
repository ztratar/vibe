define("views/questionPickerView", 
  ["backbone","text!templates/questionPickerView.html","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var template = __dependency2__;

    var QuestionPickerView = Backbone.View.extend({
    	className: 'question-picker',
    	template: _.template(template),
    	render: function() {
    		this.$el.html(this.template());
    		return this;
    	}
    });

    __exports__["default"] = QuestionPickerView;
  });