
var gTestLevel = [
[4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
[4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
[4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
[4,4,4,4,4,4,4,4,3,3,3,3,3,3,3,4,4,4,4,4,4,4,4,4],
[4,4,4,4,4,4,4,3,3,1,1,1,1,1,3,3,4,4,4,4,4,4,4,4],
[4,4,4,4,4,4,3,3,1,1,1,1,1,1,1,3,3,4,4,4,4,4,4,4],
[4,4,4,4,4,3,3,1,1,2,2,1,1,1,1,1,3,4,4,4,4,4,4,4],
[4,4,4,4,3,3,1,1,1,2,2,1,1,1,1,1,3,3,4,4,4,4,4,4],
[4,4,4,4,3,3,1,1,1,1,1,1,1,1,1,1,1,3,3,4,4,4,4,4],
[4,4,4,4,4,3,3,1,1,1,1,1,1,1,1,1,1,3,3,4,4,4,4,4],
[4,4,4,4,4,3,3,3,1,1,1,1,2,1,1,1,1,3,3,4,4,4,4,4],
[4,4,4,4,4,4,3,3,3,3,1,1,1,1,1,1,3,3,4,4,4,4,4,4],
[4,4,4,4,4,4,4,4,4,3,3,3,3,3,3,3,3,4,4,4,4,4,4,4],
[4,4,4,4,4,4,4,4,4,4,3,3,3,3,3,3,4,4,4,4,4,4,4,4],
[4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
[4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4]];

Level = Class.extend({
	entities: new Array(),
	w: 0,
	h: 0,
	map: null,
	seed: null,

	init: function(w, h, seed) {
		this.w = w;
		this.h = h;
		this.seed = seed;

		Math.seedrandom(seed);

		console.log("Creating level with seed: " + seed);

		this.map = gTestLevel;//new LevelGen().createSurfaceMap(w, h);

		for (var y = 0; y < w; y++) {
			for (var x = 0; x < h; x++) {
				// console.log("this.map[y][x]="+this.map[y][x]);
			}
		}
	},

	addEntity: function(entity) {
		this.entities.push(entity);
	},

	renderBackground: function(screen, xScroll, yScroll) {
		for (var y = 0; y < this.w; y++) {
			for (var x = 0; x < this.h; x++) {
				gTileLibrary[this.map[y][x]].render(screen, x, y);
			}
		}
	},

	renderSprites: function(screen, xScroll, yScroll) {
		for (var i = 0; i < this.entities.length; i++) {
			this.entities[i].render(screen, xScroll, yScroll);
		}
	},

	tick: function() {
		for (var i = 0; i < this.entities.length; i++) {
			this.entities[i].tick();
		}
	}
});