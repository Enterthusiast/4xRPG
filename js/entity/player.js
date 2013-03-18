var DIR_DOWN = 0;
var DIR_UP = 1;
var DIR_LEFT = 2;
var DIR_RIGHT = 3;

var MOVE_UNIT = 2;

var sprites = [
	['char_down_still.png','char_down_move1.png','char_down_move2.png', 'char_down_move1.png'],
	['char_up_still.png','char_up_move1.png','char_up_move2.png', 'char_up_move1.png'],
	['char_left_still.png','char_left_move1.png','char_left_move2.png', 'char_left_move1.png'],
	['char_right_still.png','char_right_move1.png','char_right_move2.png', 'char_right_move1.png']
];

Player = Class.extend({

	x: 0,
	y: 0,
	xr: 11,
	yr: 15,
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
			if (xa != 0 && this.moveTo(xa, 0)) stopped = false;
			if (ya != 0 && this.moveTo(0, ya)) stopped = false;

			if (!stopped) {
				var xt = this.x >> 5;
				var yt = this.y >> 5;
				this.level.getTile(xt, yt).steppedOn(this.level, xt, yt, this);
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

		var xto0 = (this.x - this.xr + 16) >> 5;
		var yto0 = (this.y - this.yr + 16) >> 5;
		var xto1 = (this.x + this.xr + 16) >> 5;
		var yto1 = (this.y + this.yr + 16) >> 5;

		var xt0 = ((this.x + xa) - this.xr + 16) >> 5;
		var yt0 = ((this.y + ya) - this.yr + 16) >> 5;
		var xt1 = ((this.x + xa) + this.xr + 16) >> 5;
		var yt1 = ((this.y + ya) + this.yr + 16) >> 5;

		var blocked = false;
		for (var yt = yt0; yt <= yt1; yt++) {
			for (var xt = xt0; xt <= xt1; xt++) {
				if (xt >= xto0 && xt <= xto1 && yt >= yto0 && yt <= yto1) continue;
				// this.level.getTile(xt, yt).bumpedInto(this.level, xt, yt, this);
				if (!this.level.getTile(xt, yt).mayPass(this.level, xt, yt, this)) {
					// console.log(this.level.getTile(xt, yt).name+" @ "+xt+","+yt+" /p @ "+(this.x >> 5)+","+(this.y >> 5));
					blocked = true;
					return false;
				}
			}
		}

		this.x += xa;
		this.y += ya;

		// console.log("x:"+this.x+" /y:"+this.y+" /xa:"+xa+" /ya:"+ya);

		return true;
	},

	tick: function() {
		var xa = 0;
		var ya = 0;
		if (this.input.up.down) ya -= MOVE_UNIT;
		if (this.input.down.down) ya += MOVE_UNIT;
		if (this.input.left.down) xa -= MOVE_UNIT;
		if (this.input.right.down) xa += MOVE_UNIT;

		this.move(xa, ya);
	},

	render: function(screen, xScroll, yScroll) {
		var tile = ((this.walkDist >> 3) % sprites[this.dir].length);

		screen.render(sprites[this.dir][tile], screen.w / 2, screen.h / 2);
	}
});
