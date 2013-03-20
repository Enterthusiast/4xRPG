
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

	renderText: function(text, x, y, align, baseLine, font) {
		this.ctx.font = font;

		this.ctx.textBaseline = baseLine;
		this.ctx.textAlign = align;

		this.ctx.fillText(text, x, y);
	},

	renderDebugText: function(text, position) {
		var font = 'bold 12px sans-serif';
		var align = '';
		var baseLine = '';
		var textX = 0;
		var textY = 0;

		if (position == 'bottom-right') {
			baseLine = 'bottom';
			align = 'right';
			textX = this.xTiles * this.tileSize;
			textY = this.yTiles * this.tileSize;
		} else if (position == 'top-right') {
			baseLine = 'top';
			align = 'right';
			textX = this.xTiles * this.tileSize;
			textY = 0;
		} else if (position == 'bottom-left') {
			baseLine = 'bottom';
			align = 'left';
			textX = 0;
			textY = this.yTiles * this.tileSize;
		} else if (position == 'top-left') {
			baseLine = 'top';
			align = 'left';
			textX = 0;
			textY = 0;
		}

		this.renderText(text, textX, textY, align, baseLine, font);
	}
});
