
Screen = Class.extend({
	ctx: null,
	xTiles: 0,
	yTiles: 0,
	tileSize: 0,
	xOffset: 0,
	yOffset: 0,
	w: 0,
	h: 0,

	init: function(ctx, xTiles, yTiles, tileSize) {
		this.ctx = ctx;
		this.xTiles = xTiles;
		this.yTiles = yTiles;
		this.tileSize = tileSize;
		this.w = xTiles * tileSize;
		this.h = yTiles * tileSize;
	},

	render: function(sprite, x, y) {
		drawSprite(this.ctx, sprite, x - this.xOffset, y - this.yOffset);
	},

	clearBackground: function() {
		// Store the current transformation matrix
		this.ctx.save();

		// Use the identity matrix while clearing the canvas
		this.ctx.setTransform(1, 0, 0, 1, 0, 0);
		this.ctx.clearRect(0, 0, this.xTiles * this.tileSize, this.yTiles * this.tileSize);

		// Restore the transform
		this.ctx.restore();
	},

	setOffset: function(x, y) {
		this.xOffset = x;
		this.yOffset = y;
	},

	renderDebugText: function(text, position) {
		this.ctx.font = 'bold 12px sans-serif';
		var textX = 0;
		var textY = 0;

		if (position == 'bottom-right') {
			this.ctx.textBaseline = 'bottom';
			this.ctx.textAlign = 'right';
			textX = this.xTiles * this.tileSize;
			textY = this.yTiles * this.tileSize;
		} else if (position == 'top-right') {
			this.ctx.textBaseline = 'top';
			this.ctx.textAlign = 'right';
			textX = this.xTiles * this.tileSize;
			textY = 0;
		} else if (position == 'bottom-left') {
			this.ctx.textBaseline = 'bottom';
			this.ctx.textAlign = 'left';
			textX = 0;
			textY = this.yTiles * this.tileSize;
		} else if (position == 'top-left') {
			this.ctx.textBaseline = 'top';
			this.ctx.textAlign = 'left';
			textX = 0;
			textY = 0;
		}

		this.ctx.fillText(text, textX, textY);
	}
});