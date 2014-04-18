define("views/HeaderView", 
  ["backbone","jquery","underscore","text!templates/HeaderView.html","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __exports__) {
    "use strict";

    var template = __dependency4__;

    var HeaderView = Backbone.View.extend({

    	className: 'header-view',

    	initialize: function(opts) {

    		// ----------------
    		//
    		// TODO: animate
    		//
    		// animations are linked in
    		// screen-animations.less
    		//
    		// Available: [
    		//   'pushRight',
    		//   'pushLeft',
    		//   'slideUp',
    		//   'slideDown'
    		// ]
    		//
    		// ----------------

    		this.data = _.extend({
    			title: '',
    			leftAction: undefined,
    			rightAction: undefined,
    			animate: false
    		}, opts);
    	},

    	render: function() {
    		this.$el.html(_.template(template, this.data));
    		this.bindButtonActions();
    	},

    	bindButtonActions: function() {
    		// Clear old actions off buttons
    		this.$('a').off('click.header');

    		// Animations should be here... from data

    		// Bind new actions to the buttons
    		if (this.data.leftAction && typeof this.data.leftAction.click === 'function') {
    			this.$('a.left-action').on('click.header', this.data.leftAction.click);
    		}
    		if (this.data.rightAction && typeof this.data.rightAction.click === 'function') {
    			this.$('a.right-action').on('click.header', this.data.rightAction.click);
    		}
    	},

    	setButtons: function(opts) {
    		this.data = _.extend(this.data, opts);
    		this.render();

    		if (this.data.animate === false) {
    			this.$('a').addClass('now');	
    		}
    		this.$('a').addClass('flyIn');	
    	}

    });

    __exports__["default"] = HeaderView;
  });