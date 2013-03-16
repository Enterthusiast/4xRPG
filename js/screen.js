
Screen = Class.extend({
	ctx: null,
	xTiles: 0,
	yTiles: 0,
	tileSize: 0,

	init: function(ctx, xTiles, yTiles, tileSize) {
		this.ctx = ctx;
		this.xTiles = xTiles;
		this.yTiles = yTiles;
		this.tileSize = tileSize;		
	},

	render: function(sprite, x, y) {
		// drawSprite(this.ctx, sprite, x * this.tileSize, y * this.tileSize);
		drawSprite(this.ctx, sprite, x, y);
	},

	clearBackground: function() {
		// Store the current transformation matrix
		this.ctx.save();

		// Use the identity matrix while clearing the canvas
		this.ctx.setTransform(1, 0, 0, 1, 0, 0);
		this.ctx.clearRect(0, 0, this.xTiles * this.tileSize, this.yTiles * this.tileSize);

		// Restore the transform
		this.ctx.restore();
	}
});