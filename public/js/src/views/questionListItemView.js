import 'backbone';
import Analytics from 'helpers/analytics';
import ConfirmDialogView from 'views/confirmDialogView';

module moment from 'moment';
module template from 'text!templates/questionListItemView.html';

var QuestionListItemView = Backbone.View.extend({

	tagName: 'li',

	template: _.template(template),

	events: {
		'click a.action': 'actionTriggered',
		'click ul.days a': 'dayClicked',
		'click a.send-now': 'sendNow',
		'click span.results-label': 'togglePrivacy',
		'click label': 'togglePrivacy',
		'mouseenter span.results-label': 'fakeShowCheckHover',
		'mouseleave span.results-label': 'fakeHideCheckHover'
	},

	initialize: function(opts) {
		opts = opts || {};

		this.button = opts.button || {};
		this.question_type = opts.question_type || '';

		this.model.on('change', this.render, this);
		this.model.on('destroy', this.remove, this);
	},

	render: function() {
		var that = this;

		if (this.question_type === 'selected'
				&& !this.model.get('active')) {
			this.remove();
			return;
		}

		var sentInLastDay = (Date.now() - Date.parse(this.model.get('time_last_sent'))) < 1000 * 60 * 60 * 24;

		this.$el.html(this.template({
			model: this.model.toJSON(),
			className: this.button.className,
			icon: this.button.icon,
			question_type: this.question_type,
			sentInLastDay: sentInLastDay,
			lastSentString: moment(this.model.get('time_last_sent')).fromNow()
		}));

		this.$sendNowButton = this.$('.send-now');
		this.$checkbox = this.$('input[type="checkbox"]');
		this.$cblabel = this.$('label');

		return this;
	},

	actionTriggered: function() {
		if (this.button.click) {
			return this.button.click(this.model);
		}

		return false;
	},

	dayClicked: function(ev) {
		var $target = $(ev.currentTarget),
			day = $target.attr('data-day'),
			dayMap = {
				'monday': 0,
				'tuesday': 1,
				'wednesday': 2,
				'thursday': 3,
				'friday': 4
			},
			days = _.clone(this.model.get('send_on_days'));

		if (days[dayMap[day]] > 1) {
			days[dayMap[day]] = 0;
		} else {
			days[dayMap[day]]++;
		}

		this.model.save({
			send_on_days: days
		});
		this.model.trigger('change');

		return false;
	},

	sendNow: function() {
		var that = this;

		this.$sendNowButton
			.html('Sending...')
			.attr('disabled', 'disabled');

		Analytics.log({
			eventCategory: 'question',
			eventAction: 'sent_now',
			eventLabel: this.model.get('body')
		});

		$.ajax({
			type: 'POST',
			url: this.model.url() + '/send_now',
			success: function(data) {
				that.$sendNowButton.html('Sent!')
			}
		});

		return false;
	},

	togglePrivacy: function() {
		var that = this,
			checked = this.$checkbox.prop('checked');

		if (checked) {
			var confirmView = new ConfirmDialogView({
				title: 'Are you sure?',
				body: 'The votes on the question, past and present, will be made viewable by employees. You can make it private again at any time.',
				onConfirm: function() {
					that.$checkbox.prop('checked', false);
					that.model.makePublic(function() {
						window.Vibe.appView.showNotif('Saved!', {
							type: 'top'
						});
					});
				}
			});
			window.Vibe.appView.showOverlay(confirmView, {
				onRemove: function() {
					window.Vibe.appRouter.homeView.managePolls();
				}
			});
		} else {
			this.$checkbox.prop('checked', 'checked');
			this.model.makePrivateToAdmins(function() {
				window.Vibe.appView.showNotif('Saved!', {
					type: 'top'
				});
			});
		}

		return false;
	},

	fakeShowCheckHover: function() {
		this.$cblabel.addClass('fakeHover');
	},

	fakeHideCheckHover: function() {
		this.$cblabel.removeClass('fakeHover');
	}

});

export default = QuestionListItemView;
