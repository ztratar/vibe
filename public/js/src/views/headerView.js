import 'backbone';
import 'jquery';
import 'underscore';

module template from 'text!templates/HeaderView.html';

var HeaderView = Backbone.View.extend({

	className: 'header-view',

	initialize: function(opts) {
		this.data = {};
		this.initialData = {
			title: '',
			leftAction: false,
			rightAction: false,
			animate: false
		};
		_.extend(this.data, this.initialData, opts);
		this.$el.append('<div class="container"></div>');
		this.$container = this.$('.container');
	},

	render: function(skipAnimation) {
		if (!skipAnimation) {
			if (this.oldComponents) this.removeOldComponents();
			this.oldComponents = this.$('.header-components');
			this.newComponents = $('<div class="header-components new"></div>');
			this.$container.append(this.newComponents);
		}
		this.newComponents.html(_.template(template, this.data));
		this.bindButtonActions();

		if (this.data.leftAction.num_unread) {
			_.delay(_.bind(function() {
				this.$('span.unread-num').addClass('bounce');
			}, this), 30);
		}
	},

	renderCurrentComponents: function() {
		this.newComponents.attr('class', 'header-components current');
	},

	animateToNewComponents: function(animation) {
		this.newComponents.addClass('animate-' + animation);
		_.delay(_.bind(function() {
			if (this.oldComponents) {
				this.oldComponents.attr('class', 'header-components old animate-' + animation);
			}
			this.newComponents.attr('class', 'header-components current animate-' + animation);
		}, this), 4);
		this.removeOldComponents();
	},

	removeOldComponents: function() {
		var removeComponents = this.oldComponents;
		if (removeComponents) {
			_.delay(_.bind(function() {
				removeComponents.remove();
			}, this), 600);
		}
	},

	bindButtonActions: function() {
		// Clear old actions off buttons
		this.$('a').off('click.header touchstart.header');

		// Bind new actions to the buttons
		if (this.data.leftAction && typeof this.data.leftAction.click === 'function') {
			this.$('a.left-action').on('touchstart.header click.header', this.data.leftAction.click);
		}
		if (this.data.rightAction && typeof this.data.rightAction.click === 'function') {
			this.$('a.right-action').on('touchstart.header click.header', this.data.rightAction.click);
		}
	},

	setButtons: function(opts) {
		var anim = this.data.animate;
		_.extend(this.data, this.initialData, opts);
		this.data.animate = anim;

		this.render();

		if (opts.headerSize === 'small') {
			this.newComponents.find('h2').addClass('small');
		}

		if (this.data.animate === false) {
			this.$('a').addClass('now');
		}
		this.$('a').addClass('flyIn');
	},

	changeUnreadNum: function(newNum) {
		if (this.data.leftAction.id === 'notifications') {
			this.data.leftAction.num_unread = newNum;
			this.render(true);
		}
	},

	setHomeButtons: function() {
		window.Vibe.appView.headerView.setButtons({
			title: '',
			leftAction: {
				id: 'notifications',
				icon: '#61954',
				click: function() {
					window.Vibe.appView.openNotifications();
					return false;
				}
			},
			rightAction: {
				title: '',
				icon: '#61886',
				click: function() {
					window.Vibe.appRouter.navigateWithAnimation('settings', 'pushLeft', {
						trigger: true
					});
					return false;
				}
			}
		});
	}

});

export default = HeaderView;
