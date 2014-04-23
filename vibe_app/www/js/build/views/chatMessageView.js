define("views/chatMessageView", 
  ["backbone","moment","text!templates/chatMessageView.html","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __exports__) {
    "use strict";

    var moment = __dependency2__;
    var template = __dependency3__;

    var ChatMessageView = Backbone.View.extend({

    	template: _.template(template),

    	tagName: 'li',

    	className: 'chatMessage-view',

    	initialize: function() {
    		this.model.on('change', this.render, this);
    	},

    	render: function() {
    		this.$el.html(this.template(_.extend(this.model.toJSON(),{
    			user: this.model.get('user').toJSON(),
    			timeCreated: moment(this.model.get('timeCreated')).fromNow()
    		})));
    		return this;
    	}

    });

    __exports__["default"] = ChatMessageView;
  });