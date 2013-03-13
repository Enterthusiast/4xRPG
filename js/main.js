

var gSpriteSheets = {};

var playerSprites = ['char0.png','char1.png','char2.png', 'char1.png'];

var gCanvas = null;
var ctx = null;
var frameRate = 50
var framePeriod = 10000/ frameRate;
var frame = 0;

var playerX = 32;
var playerY = 32;

var setup = function() {
	gCanvas = $('#game-canvas');
	ctx = gCanvas[0].getContext('2d');

	gCanvas.attr('width', 1200);
	gCanvas.attr('height', 720);
	gCanvas.attr('tabindex', 1);
	gCanvas.focus();

	gInputEngine.setup(gCanvas);
}

var animate = function() {
	gInputEngine.update();

	// Store the current transformation matrix
	ctx.save();

	// Use the identity matrix while clearing the canvas
	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.clearRect(0, 0, gCanvas.attr('width'), gCanvas.attr('height'));

	// Restore the transform
	ctx.restore();

	// Draw the main character.
	drawSprite(ctx, playerSprites[frame % playerSprites.length], playerX++, playerY++)

	// Update current frame.
	frame = (frame + 1) % 30;
}

$(document).ready(function() {
	setup();

	setInterval(animate, framePeriod);
});

