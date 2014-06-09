define("views/userListView", 
  ["backbone","views/userListItemView","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";

    var UserListItemView = __dependency2__["default"];

    var UserListView = Backbone.View.extend({

    	tagName: 'ul',

    	className: 'user-list-view',

    	initialize: function(opts) {
    		if (!opts || !opts.users) return false;

    		this.users = opts.users;
    		this.users.on('reset', this.addAll, this);
    		this.users.on('add', this.addOne, this);

    		if (opts.buttons) {
    			this.buttons = opts.buttons;
    		}
    	},

    	render: function() {
    		this.$el.html('');
    		this.addUsers();
    		return this;
    	},

    	addUsers: function() {
    		this.$el.html('');
    		this.users.each(this.addOne, this);
    	},

    	addOne: function(user) {
    		var userListItemView = new UserListItemView({
    				model: user,
    				buttons: this.buttons
    			});

    		this.$el.append(userListItemView.$el);
    		userListItemView.render();
    	}

    });

    __exports__["default"] = UserListView;
  });