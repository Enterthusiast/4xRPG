
Level = Class.extend({
	entities: new Array(),

	init: function() {

	},

	addEntity: function(entity) {
		this.entities.push(entity);
	},

	renderBackground: function(ctx, xScroll, yScroll) {

	},

	renderSprites: function(ctx, xScroll, yScroll) {
		for (var i = 0; i < this.entities.length; i++) {
			this.entities[i].render(ctx, xScroll, yScroll);
		}
	},

	tick: function() {
		for (var i = 0; i < this.entities.length; i++) {
			this.entities[i].tick();
		}
	}
});