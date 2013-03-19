
var gFRAMERATE = 60
var TILESIZE = 32;
var XTILES = 24;
var YTILES = 16;

var MAP_W = 200;
var MAP_H = 200;

if (window.performance.now) {
    console.log("+++ Using high performance timer");
    getTimestamp = function() { return window.performance.now(); };
} else {
    if (window.performance.webkitNow) {
        console.log("+++ Using webkit high performance timer");
        getTimestamp = function() { return window.performance.webkitNow(); };
    } else {
        console.log("+++ Using low performance timer");
        getTimestamp = function() { return new Date().getTime(); };
    }
}

var lastTime = getTimestamp();
var fpsCounter = getTimestamp();
var msPerTick = 1000 / gFRAMERATE;
var frames = 0;
var ticks = 0;
var unprocessed = 0;
var gGame = null;
var fps = 0;

var GameRunner = function() {
	if (gSpriteSheetReady == false) {
		return;
	}

	var now = getTimestamp();
	unprocessed += (now - lastTime) / msPerTick;
	lastTime = now;

	while (unprocessed >= 1) {
		ticks++;
		gGame.tick();
		unprocessed -=1;
	}

	frames++;
	gGame.render();

	if (getTimestamp() - fpsCounter > 1000) {
		fpsCounter += 1000;
		fps = frames;
		frames = 0;
		ticks = 0
	}
	gGame.screen.renderDebugText(fps + " fps", 'top-left');
}

Game = Class.extend({
	canvas: null,
	ctx: null,
	level: null,
	gameTime: 0,
	running: false,
	player: false,

	init: function() {
		this.canvas = $('#game-canvas');
		this.ctx = this.canvas[0].getContext('2d');

		this.canvas.attr('width', XTILES * TILESIZE);
		this.canvas.attr('height', YTILES * TILESIZE);
		this.canvas.attr('tabindex', 1);
		this.canvas.focus();
		this.screen = new Screen(this.ctx, XTILES, YTILES, TILESIZE);

		gInputHandler = new InputHandler(this.canvas);

		this.level = new Level(MAP_W, MAP_H, 'siryessir');
		this.player = new Player(this.level, gInputHandler, (MAP_W * TILESIZE) / 2, (MAP_H * TILESIZE) / 2);
	},

	start: function() {
		this.running = true;
		console.log("Ready to go ...");
		window.setInterval(GameRunner, 2);
	},

	hasFocus: function() {
		// todo ...
		return true;
	},

	tick: function() {
		this.tickCount++;

		if (!this.hasFocus()) {
			gInputHandler.releaseAll();
		} else {
			this.gameTime++;

			gInputHandler.tick();

			this.level.tick();
		}
	},

	renderFocusGUI: function() {
		// todo ...
	},

	render: function() {
		var halfW = this.screen.w / 2;
		var halfH = this.screen.h / 2;
		var xScroll = this.player.x - halfW;
		var yScroll = this.player.y - halfH;

		this.screen.clearBackground();

		this.level.renderBackground(this.screen, xScroll, yScroll);
		this.level.renderSprites(this.screen, xScroll, yScroll);

		// this.level.renderMinimap(this.screen, xScroll, yScroll);

		if (!this.hasFocus()) renderFocusGUI();
	}
});

// var d_lastxScroll = 0;
// var d_lastyScroll = 0;
// var d_lastxPlayer = 0;
// var d_lastyPlayer = 0;

$(document).ready(function() {
	gGame = new Game();

	gGame.start();
});

