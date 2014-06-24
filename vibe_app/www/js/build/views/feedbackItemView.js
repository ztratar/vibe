define("views/feedbackItemView", 
  ["underscore","backbone","views/confirmDialogView","views/chatView","text!templates/feedbackItemView.html","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __dependency5__, __exports__) {
    "use strict";

    var ConfirmDialogView = __dependency3__["default"];
    var ChatView = __dependency4__["default"];

    var template = __dependency5__;

    var FeedbackItemView = Backbone.View.extend({

    	tagName: 'li',

    	className: 'feedback-item-view',

    	template: _.template(template),

    	events: {
    		'click a.agree': 'agree',
    		'click a.agreed': 'undoAgree',
    		'click a.discuss': 'discuss',
    		'click a.pull-down': 'adminPullDown'
    	},

    	initialize: function(opts) {
    		var that = this;

    		this.model = opts.model;

    		this.model.on('change', this.render, this);
    		this.model.get('feedback').on('change', this.render, this);

    		this.model.on('destroy', this.remove, this);

    		window.Vibe.faye.subscribe('/api/feedback/' + this.model.get('feedback').get('_id') + '/vote_change', function(newNumVotes) {
    			debugger;
    			that.model.get('feedback').set({
    				'num_votes': newNumVote
    			});
    			that.$score.addClass('pop');

    			setTimeout(function() {
    				that.$score.removeClass('pop');
    			}, 500);
    		});
    	},

    	render: function() {
    		var modelJSON = this.model.toJSON();

    		this.$el.html(this.template({
    			model: modelJSON
    		}));

    		this.$score = this.$('.score');

    		return this;
    	},

    	agree: function() {
    		var that = this,
    			feedback = this.model.get('feedback');

    		feedback.agree();

    		this.$score.addClass('pop');

    		setTimeout(function() {
    			that.$score.removeClass('pop');
    		}, 500);

    		return false;
    	},

    	undoAgree: function() {
    		var that = this,
    			feedback = this.model.get('feedback');

    		feedback.undoAgree();

    		this.$score.addClass('pop-reverse');

    		setTimeout(function() {
    			that.$score.removeClass('pop-reverse');
    		}, 500);

    		return false;
    	},

    	discuss: function() {
    		var chatView = new ChatView({
    			chatTitle: this.model.get('feedback').get('body'),
    			chatsUrl: '/api/feedback/' + this.model.get('feedback').get('_id') + '/chats'
    		});
    		window.Vibe.appView.showOverlay(chatView);

    		return false;
    	},

    	adminPullDown: function() {
    		var that = this,
    			confirmView = new ConfirmDialogView({
    				title: 'Are you sure?',
    				body: 'As an admin, you can remove this piece of feedback instantly by clicking confirm. This will also delete all relevant discussion.',
    				onConfirm: function() {
    					that.model.trigger('destroy');
    					that.model.get('feedback').pullDown();
    				}
    			});

    		window.Vibe.appView.showOverlay(confirmView);

    		return false;
    	}

    });

    __exports__["default"] = FeedbackItemView;
  });