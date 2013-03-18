
Key = Class.extend({
	presses: 0,
	absorbs: 0,
	down: 0,
	clicked: 0,

	init: function() {
		gKeys.push(this);
	},

	toggle: function(pressed) {
		if (pressed != this.down) {
			this.down = pressed;
		}
		if (pressed) {
			this.presses++;
		}
	},

	tick: function() {
		if (this.absorbs < this.presses) {
			this.absorbs++;
			this.clicked = true;
		} else {
			this.clicked = false;
		}
	}
});

var gKeys = new Array();

InputHandler = Class.extend({
	
	up: new Key(),
	down: new Key(),
	left: new Key(),
	right: new Key(),
	attack: new Key(),
	menu: new Key(),
	sneak: new Key(), 

	bindings: {},
	mouse: {
		x: 0,
		y: 0,
	},

	init: function(canvas) {
		this.bind(90, 'move-up');
		this.bind(81, 'move-left');
		this.bind(83, 'move-down');
		this.bind(68, 'move-right');
		this.bind(17, 'attack');
		this.bind(27, 'menu');
		this.bind(16, 'sneak');

		canvas.mousemove(this.onMouseMove);
		canvas.keydown(this.onKeyDown);
		canvas.keyup(this.onKeyUp);
	},

	onMouseMove: function(event) {
		gInputHandler.mouse.x = event.clientX;
		gInputHandler.mouse.x = event.clientY;
	},

	onKeyDown: function(event) {
		var keyBinding = gInputHandler.bindings[event.keyCode];
		gInputHandler.toggle(true, keyBinding);
	},

	onKeyUp: function(event) {
		var keyBinding = gInputHandler.bindings[event.keyCode];
		gInputHandler.toggle(false, keyBinding);
	},

	bind: function(key, action) {
		this.bindings[key] = action;
	},

	toggle: function(pressed, key) {
		var movePixels = 5;

		if (key == 'move-up') gInputHandler.up.toggle(pressed);
		if (key == 'move-left') gInputHandler.left.toggle(pressed);
		if (key == 'move-down') gInputHandler.down.toggle(pressed);
		if (key == 'move-right') gInputHandler.right.toggle(pressed);
		if (key == 'attack') gInputHandler.attack.toggle(pressed);
		if (key == 'menu') gInputHandler.menu.toggle(pressed);
		if (key == 'sneak') gInputHandler.sneak.toggle(pressed);
	},

	tick: function() {
		for (var i = 0; i < gKeys.length; i++) {
			gKeys[i].tick();
		}
	},

	releaseAll: function() {
		for (var i = 0; i < gKeys.length; i++) {
			gKeys[i].down = false;
		}
	}
});

var gInputHandler = null;