
InputEngineClass = Class.extend({

	bindings: {},
	actions: {},
	mouse: {
		x: 0,
		y: 0,
	},

	onMouseMove: function(event) {
		gInputEngine.mouse.x = event.clientX;
		gInputEngine.mouse.x = event.clientY;
	},

	onKeyDown: function(event) {
		var keyBinding = gInputEngine.bindings[event.keyCode];
		gInputEngine.actions[keyBinding] = true;
	},

	onKeyUp: function(event) {
		var keyBinding = gInputEngine.bindings[event.keyCode];
		gInputEngine.actions[keyBinding] = false;
	},

	setup: function(canvas) {
		this.bind(90, 'move-up');
		this.bind(81, 'move-left');
		this.bind(83, 'move-down');
		this.bind(68, 'move-right');

		canvas.mousemove(this.onMouseMove);
		canvas.keydown(this.onKeyDown);
		canvas.keyup(this.onKeyUp);
	},

	bind: function(key, action) {
		this.bindings[key] = action;
	},

	update: function() {

		if (this.actions['move-up']) {
			console.log("Up!");
		}
		if (this.actions['move-left']) {
			console.log("Left!");
		}
		if (this.actions['move-down']) {
			console.log("Down!");
		}
		if (this.actions['move-right']) {
			console.log("Right!");
		}
	}
});

var gInputEngine = new InputEngineClass();