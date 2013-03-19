
// var d_lastX = 0;
// var d_lastY = 0;
// var d_once = 0;

Level = Class.extend({
	entities: new Array(),
	w: 0,
	h: 0,
	map: null,
	seed: null,
	minimap: null,

	init: function(w, h, seed) {
		this.w = w;
		this.h = h;
		this.seed = seed;

		Math.seedrandom(seed);

		console.log("Creating level with seed: " + seed);

		this.map = new LevelGen().createSurfaceMap(w, h);

		// for (var y = 0; y < w; y++) {
		// 	for (var x = 0; x < h; x++) {
		// 		console.log("this.map["+y+"]["+x+"]="+this.map[y][x]);
		// 	}
		// }
	},

	addEntity: function(entity) {
		this.entities.push(entity);
	},

	renderBackground: function(screen, xScroll, yScroll) {
		var x0 = xScroll >> 5;
		var y0 = yScroll >> 5;

		screen.setOffset(xScroll, yScroll);
		for (var y = y0; y < screen.yTiles + y0 + 2; y++) {
			for (var x = x0; x < screen.xTiles + x0 + 2; x++) {
				gTileLibrary[this.map[y][x]].render(screen, x * screen.tileSize, y * screen.tileSize);
			}
		}
		screen.setOffset(0, 0);
	},

	generateMinimap: function(screen) {
		this.minimap = screen.ctx.createImageData(this.w, this.h);
		var color = { r: 0, g: 0, b: 0, a: 255 };
		for (var y = 0; y < this.h; y++) {
			for (var x = 0; x < this.w; x++) {
				var index = (x + y * this.minimap.width) * 4;

				if (gTileLibrary[this.map[y][x]].name == 'grass') {
					color.r = 100;
					color.g = 164;
					color.b = 44;
				}
				if (gTileLibrary[this.map[y][x]].name == 'water') {
					color.r = 131;
					color.g = 198;
					color.b = 255;
				}
				if (gTileLibrary[this.map[y][x]].name == 'sand') {
					color.r = 217;
					color.g = 183;
					color.b = 92;
				}
				if (gTileLibrary[this.map[y][x]].name == 'rock') {
					color.r = 129;
					color.g = 139;
					color.b = 139;
				}

				this.minimap.data[index + 0] = color.r;
				this.minimap.data[index + 1] = color.g;
				this.minimap.data[index + 2] = color.b;
				this.minimap.data[index + 3] = color.a;
			}
		}
	},

	renderMinimap: function(screen, xScroll, yScroll) {
		if (this.minimap == null) {
			this.generateMinimap(screen);
		}

		screen.ctx.putImageData(this.minimap, 0, 0);
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
	},

	getTile: function(xt, yt) {
		// if (d_lastX != xt || d_lastY != yt) {
		// 	d_lastX = xt;
		// 	d_lastY = yt;
			
		// 	console.log("tile @ xt="+xt+" /yt="+yt+" tile:"+this.map[yt][xt]);
		// }
		return gTileLibrary[this.map[yt][xt]];
	}
});