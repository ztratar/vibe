import 'backbone';
import 'underscore';

module Hammer from 'hammer';
module jqueryHammer from 'jqueryHammer';

var delegateEventSplitter = /^(\S+)\s*(.*)$/,
	hammerEvents = [
		'hold',
		'tap',
		'doubletap',
		'drag', 'dragstart', 'dragend', 'dragup', 'dragdown', 'dragleft', 'dragright',
		'swipe', 'swipeup', 'swipedown', 'swipeleft', 'swiperight',
		'transform', 'transformstart', 'transformend',
		'rotate',
		'pinch', 'pinchin', 'pinchout',
		'touch',
		'release',
		'gesture'
	];

var BaseView = Backbone.View.extend({

	delegateEvents: function(events) {
		if (!(events || (events = _.result(this, 'events')))) return this;

		this.undelegateEvents();

		for (var key in events) {
			var method = events[key];
			if (!_.isFunction(method)) method = this[events[key]];
			if (!method) continue;

			var match = key.match(delegateEventSplitter);
			var eventName = match[1], selector = match[2];
			method = _.bind(method, this);

			if (_.contains(hammerEvents, eventName)) {
				eventName += '.delegateEvents' + this.cid;
				if (selector === '') {
					selector = this.$el;
				} else {
					selector = this.$el.find(selector);
				}
				if (selector.length) {
					_.each(selector, function(selectItem) {
						$(selectItem)
							.hammer()
							.off(eventName)
							.on(eventName, method);
					});
				}
			} else {
				eventName += '.delegateEvents' + this.cid;
				if (selector === '') {
					this.$el.on(eventName, method);
				} else {
					this.$el.on(eventName, selector, method);
				}
			}
		}

		return this;
	}

});

export default BaseView;
