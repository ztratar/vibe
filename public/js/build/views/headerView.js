define("views/HeaderView", 
  ["backbone","jquery","underscore","text!templates/HeaderView.html","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __exports__) {
    "use strict";

    var template = __dependency4__;

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
    	},

    	render: function() {
    		if (this.oldComponents) this.removeOldComponents();
    		this.oldComponents = this.$('.header-components');
    		this.newComponents = $('<div class="header-components new"></div>');
    		this.$el.append(this.newComponents);
    		this.newComponents.html(_.template(template, this.data));
    		this.bindButtonActions();
    	},

    	renderCurrentComponents: function() {
    		this.newComponents.attr('class', 'header-components current');
    	},

    	animateToNewComponents: function(animation) {
    		console.log(animation);
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

    		if (this.data.animate === false) {
    			this.$('a').addClass('now');	
    		}
    		this.$('a').addClass('flyIn');	
    	}

    });

    __exports__["default"] = HeaderView;
  });