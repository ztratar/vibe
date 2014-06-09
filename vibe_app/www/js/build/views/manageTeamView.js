define("views/manageTeamView", 
  ["backbone","underscore","moment","models/users","views/userListView","text!templates/manageTeamView.html","text!templates/pendingUserItem.html","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __dependency5__, __dependency6__, __dependency7__, __exports__) {
    "use strict";
    var moment = __dependency3__;

    var Users = __dependency4__["default"];
    var UserListView = __dependency5__["default"];

    var template = __dependency6__;
    var pendingUserTemplate = __dependency7__;

    var ManageTeamView = Backbone.View.extend({

    	className: 'manage-team-view',

    	template: _.template(template),
    	pendingUserTemplate: _.template(pendingUserTemplate),

    	events: {
    		'submit form.invite-user': 'inviteUser',
    		'click a.uninvite': 'uninviteUser'
    	},

    	initialize: function(opts) {
    		var that = this;

    		this.pendingUsers = new Users();
    		this.pendingUsers.url = '/api/users/pending';
    		this.pendingUsers.on('all', this.renderPendingUsers, this);

    		this.users = new Users();
    		this.users.url = '/api/users';

    		this.userListView = new UserListView({
    			users: this.users,
    			buttons: [{
    				className: function(model) {
    					var defClass = 'btn ';

    					if (model.isAdmin) {
    						defClass += 'btn-success';
    					} else {
    						defClass += 'btn-info';
    					}

    					return defClass;
    				},
    				text: function(model) {
    					return model.isAdmin ?
    						'Admin' :
    						'Normal';
    				},
    				click: function(model) {
    					if (model.get('isAdmin')) {
    						model.removeAdmin();
    					} else {
    						model.makeAdmin();
    					}
    				}
    			}, {
    				icon: '&#61943;',
    				className: 'x-icon',
    				click: function(model) {
    					that.users.remove(model);
    					model.destroy();
    				}
    			}]
    		});
    	},

    	render: function() {
    		this.$el.html(this.template());
    		this.$pendingUsersContainer = this.$('.pending-users');
    		this.$pendingUsers = this.$('.pending-users ul');

    		this.$('.user-list-container').html(this.userListView.$el);
    		this.userListView.render();

    		this.pendingUsers.fetch();
    		this.users.fetch();

    		return this;
    	},

    	renderPendingUsers: function() {
    		if (!this.pendingUsers.length) {
    			this.$pendingUsersContainer.hide();
    			return;
    		}

    		this.$pendingUsersContainer.show();
    		this.$pendingUsers.html('');
    		this.pendingUsers.each(this.addPendingUser, this);
    	},

    	addPendingUser: function(pUser) {
    		this.$pendingUsers.append(this.pendingUserTemplate(_.extend(pUser.toJSON(),{
    			time_invited: moment(pUser.get('time_invited')).fromNow()
    		})));
    	},

    	uninviteUser: function(ev) {
    		var $elem = $(ev.target),
    			inviteId = $elem.attr('data-invite-id'),
    			inviteModel = this.pendingUsers.get(inviteId);

    		this.pendingUsers.remove(inviteModel);

    		$.ajax({
    			type: 'DELETE',
    			url: '/api/userinvites/' + inviteModel.get('_id')
    		});
    	},

    	inviteUser: function() {
    		var that = this,
    			$email = this.$('.invite-user input'),
    			emailVal = $email.val();

    		$.ajax({
    			type: 'POST',
    			url: '/api/userinvites',
    			data: {
    				email: emailVal,
    				isAdmin: false
    			},
    			success: function(data) {
    				if (data.error) {
    					return;
    				}
    				$email.val('');
    				$email.focus();
    				that.pendingUsers.add(data);
    			}
    		});

    		return false;
    	}

    });

    __exports__["default"] = ManageTeamView;
  });