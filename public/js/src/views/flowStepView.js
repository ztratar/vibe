import 'backbone';
import 'underscore';
module template from 'text!templates/flowStepView.html';

var FlowStepView = Backbone.View.extend({

	className: 'flow-step-view',

	template: _.template(template),

	events: {
		'click a.next': 'nextStep'
	},

	initialize: function(opts) {
		// Steps is an array of steps to go through, and can have
		// the following attributes:
		//
		// - Title -> Turns into a heading
		// - Image -> Turns into an image above the heading
		// - Body -> Turns into body text
		this.steps = opts.steps;
		this.onFinish = opts.onFinish || false;
		this.name = opts.name;
		this.currentStep = 0;
		this.numSteps = this.steps.length;
	},

	render: function() {
		this.$el.html(this.template({
			steps: this.steps
		}));

		this.$el.addClass(this.name);
		this.$('.pane:eq(0)').addClass('active');
		this.$nextButton = this.$('a.next');

		return this;
	},

	nextStep: function() {
		if (this.$nextButton.hasClass('hit')) {
			return false;
		}

		this.goToStep(this.currentStep+1);
		this.$nextButton.addClass('hit');
		_.delay(_.bind(function() {
			this.$nextButton.removeClass('hit');
		}, this), 320);

		return false;
	},

	prevStep: function() {
		this.goToStep(this.currentStep-1);
	},

	goToStep: function(step) {
		var prevStep = this.currentStep;

		if (step > this.numSteps-1) {
			if (this.onFinish) {
				this.onFinish();
			}
			this.remove();
		}

		this.currentStep = step;

		if (step > prevStep) {
			this.$('.pane.active').addClass('done');
		} else {
			this.$('.pane.active').removeClass('active');
		}

		this.$('.pane:eq(' + step + ')').addClass('active');

		if (step >= this.numSteps-1) {
			this.$nextButton.html('Done!');
		} else {
			this.$nextButton.html('Next');
		}
	},

	remove: function() {
		this.trigger('remove');
	}

});

export default = FlowStepView;
