var DIR_DOWN = 0;
var DIR_UP = 1;
var DIR_LEFT = 2;
var DIR_RIGHT = 3;

var sprites = [
	['char_down_still.png','char_down_move1.png','char_down_move2.png', 'char_down_move1.png'],
	['char_up_still.png','char_up_move1.png','char_up_move2.png', 'char_up_move1.png'],
	['char_left_still.png','char_left_move1.png','char_left_move2.png', 'char_left_move1.png'],
	['char_right_still.png','char_right_move1.png','char_right_move2.png', 'char_right_move1.png']
];

Player = Class.extend({

	x: 0,
	y: 0,
	xr: 6,
	yr: 6,
	walkDist: 0,
	dir: DIR_DOWN,
	level: null,

	init: function(level, input) {
		this.level = level;
		this.input = input;

		level.addEntity(this);
	},

	move: function(xa, ya) {
		if (xa != 0 || ya != 0) {
			this.walkDist++;
			if (xa < 0) this.dir = DIR_LEFT;
			if (xa > 0) this.dir = DIR_RIGHT;
			if (ya < 0) this.dir = DIR_UP;
			if (ya > 0) this.dir = DIR_DOWN;

			var stopped = true;
			if (xa != 0 && moveTo(xa, 0)) stopped = false;
			if (ya != 0 && moveTo(0, ya)) stopped = false;

			if (!stopped) {
				var xt = this.x >> 4;
				var yt = this.y >> 4;
				level.getTile(xt, yt).steppedOn(level, xt, yt, this);
			}

			return !stopped;
		}

		return true;
	},

	moveTo: function(xa, ya) {
		if (xa != 0 && ya != 0) {
			alert("moveTo can only move one axis at a time !");
			return;
		}

		// var xto0 = (this.x - this.xr) >> 4;
		// var yto0 = (this.y - this.yr) >> 4;
		// var xto1 = (this.x + this.xr) >> 4;
		// var yto1 = (this.y + this.yr) >> 4;

		// var xt0 = ((this.x + xa) - this.xr) >> 4;
		// var yt0 = ((this.y + ya) - this.yr) >> 4;
		// var xt1 = ((this.x + xa) + this.xr) >> 4;
		// var yt0 = ((this.y + ya) + this.yr) >> 4;

		// var blocked = false;
		// for (var yt = yt0; yt < yt1; yt++) {
		// 	for (var xt = xto0; xt <= xt1; xt++) {
		// 		if (xt >= xto0 && xt <= xto1 && yt >= yto0 && yt <= yto1) continue;
		// 		level.getTile(xt, yt).bumpedInto(level, xt, yt, this);
		// 		if (!level.getTile(xt, yt).mayPass(level, xt, yt, this)) {
		// 			blocked = true;
		// 			return false;
		// 		}
		// 	}
		// }

		x += xa;
		y += ya;

		return true;
	},

	tick: function() {
		var xa = 0;
		var ya = 0;
		if (this.input.up.down) ya--;
		if (this.input.down.down) ya++;
		if (this.input.left.down) xa--;
		if (this.input.right.down) xa++;

		this.move(xa, ya);
	},

	render: function(screen, xScroll, yScroll) {
		// if (this.walkDist != 0)
		// 	console.log("walkdist>>3: "+ ((this.walkDist >> 2) % playerSprites.length))

		var tile = ((this.walkDist >> 3) % sprites[this.dir].length);

		screen.render(sprites[this.dir][tile], this.x / 32 - 1, this.y / 32 - 1);
	}
});
