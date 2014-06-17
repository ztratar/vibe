define("views/questionListItemView", 
  ["backbone","text!templates/questionListItemView.html","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";

    var template = __dependency2__;

    var QuestionListItemView = Backbone.View.extend({

    	tagName: 'li',

    	template: _.template(template),

    	events: {
    		'click a.action': 'actionTriggered',
    		'click ul.days a': 'dayClicked',
    		'click a.send-now': 'sendNow'
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
    			sentInLastDay: sentInLastDay
    		}));

    		this.$sendNowButton = this.$('.send-now');

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

    		$.ajax({
    			type: 'POST',
    			url: this.model.url() + '/send_now',
    			success: function(data) {
    				that.$sendNowButton.html('Sent!')
    			}
    		});

    		return false;
    	}

    });

    __exports__["default"] = QuestionListItemView;
  });