
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
		drawSprite(this.ctx, sprite, x * this.tileSize + this.tileSize / 2, y * this.tileSize + this.tileSize / 2);
	},

	clearBackground: function() {
		// Store the current transformation matrix
		this.ctx.save();

		// Use the identity matrix while clearing the canvas
		this.ctx.setTransform(1, 0, 0, 1, 0, 0);
		this.ctx.clearRect(0, 0, this.yTiles * this.tileSize, this.xTiles * this.tileSize);

		// Restore the transform
		this.ctx.restore();
	}
});