var CHEST_CAPACITY_DEFAULT = 500;
var CHEST_CAPACITY_STEP = 50;
var CHEST_CAPACITY_VAR = 5;

var CHEST_COUNTER_MS = 30000;

var TITLE_DISPLAY_TIME_MS = 2000;

Town = Class.extend({
	id: 0,
	name: '',
	state: 'hostile',
	chest: {
		capacity: 0,
		amount: 0,
		counter: 0
	},
	announce: false,
	entered: 'out',
	xt: 0,
	yt: 0,
	w: 21,
	h: 13,
	townLimit: {
		top: 0,
		bottom: 0,
		left: 0,
		right: 0
	},

	init: function(id, xt, yt) {
		this.xt = xt;
		this.yt = yt;
		this.id = id;
		this.name = getRandomName();
		this.chest.capacity = Math.floor(CHEST_CAPACITY_DEFAULT * Math.random()) + (Math.floor(Math.random() * CHEST_CAPACITY_VAR) * CHEST_CAPACITY_STEP);

		this.townLimit.top = Math.round(yt - this.h / 2);
		this.townLimit.bottom = this.townLimit.top + this.h;
		this.townLimit.left = Math.round(xt - this.w / 2);
		this.townLimit.right = this.townLimit.left + this.w;
	},

	tick: function(msPerTick) {
		if (this.state == 'conquered') {
			this.chest.counter += msPerTick;
			if (this.chest.counter > CHEST_COUNTER_MS && this.chest.amount < this.chest.capacity) {
				this.chest.amount++;
				this.chest.counter = 0
			}
		}
	},

	isInTown: function(x0, y0, radius) {
		if (x0 >= this.townLimit.left - radius && x0 < this.townLimit.right + radius && y0 >= this.townLimit.top - radius && y0 < this.townLimit.bottom + radius) {
			return true;
		}

		return false;
	},

	enter: function() {
		if (this.entered != 'in') {
			this.announce = true;
		}
		this.entered = 'in';
	},

	leave: function() {
		this.entered = 'out';
	},

	render: function(screen, playerX, playerY) {
		var x0 = Math.round(playerX / 32);
		var y0 = Math.round(playerY / 32);

		// screen.renderDebugText(this.name + " " + this.entered, 'bottom-left');

		if (this.announce) {
			this.announce = false;
			screen.addAnnouncementJob(this.name, this.state + " territory", TITLE_DISPLAY_TIME_MS);
		}
	}
});
