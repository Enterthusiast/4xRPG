
// var d_lastX = 0;
// var d_lastY = 0;
// var d_once = 0;

Level = Class.extend({
	entities: new Array(),
	w: 0,
	h: 0,
	map: null,
	towns: null,
	seed: null,
	minimap: null,

	init: function(w, h, seed) {
		this.w = w;
		this.h = h;
		this.seed = seed;

		Math.seedrandom(seed);

		console.log("Creating level with seed: " + seed);

		var levelGen = new LevelGen();
		this.map = levelGen.createSurfaceMap(w, h);
		this.towns = levelGen.getTowns();

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
				if (y < 0 || x < 0 || y >= this.h || x >= this.w) {
					gTileLibrary['water'].render(screen, x * screen.tileSize, y * screen.tileSize);
				} else {
					var townTile = false;
					for (var i = 0; i < this.towns.length; i++) {
						if (this.towns[i].isInTown(x, y, 0)) {
							townTile = true;
							break;
						}
					}
					var currentTile = gTileLibrary[this.map[y][x].id];
					if (townTile && currentTile.mayPass(this, x, y)) {
						gTileLibrary['dirt'].render(screen, x * screen.tileSize, y * screen.tileSize);
					} else {
						currentTile.render(screen, x * screen.tileSize, y * screen.tileSize);
					}
				}
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

				if (gTileLibrary[this.map[y][x].id].name == 'grass') {
					color.r = 100;
					color.g = 164;
					color.b = 44;
				}
				if (gTileLibrary[this.map[y][x].id].name == 'water') {
					color.r = 131;
					color.g = 198;
					color.b = 255;
				}
				if (gTileLibrary[this.map[y][x].id].name == 'sand') {
					color.r = 217;
					color.g = 183;
					color.b = 92;
				}
				if (gTileLibrary[this.map[y][x].id].name == 'rock') {
					color.r = 129;
					color.g = 139;
					color.b = 139;
				}
				if (gTileLibrary[this.map[y][x].id].name == 'tree') {
					color.r = 11;
					color.g = 92;
					color.b = 47;
				}
				if (gTileLibrary[this.map[y][x].id].name == 'cactus') {
					color.r = 129;
					color.g = 161;
					color.b = 0;
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

	renderSprites: function(screen, xScroll, yScroll, player) {
		for (var i = 0; i < this.entities.length; i++) {
			this.entities[i].render(screen, xScroll, yScroll);
		}
		for (var i = 0; i < this.towns.length; i++) {
			this.towns[i].render(screen, player.x, player.y);
		}
	},

	tick: function(msPerTick) {
		for (var i = 0; i < this.entities.length; i++) {
			this.entities[i].tick(msPerTick);
		}
		for (var i = 0; i < this.towns.length; i++) {
			this.towns[i].tick(msPerTick);
		}
	},

	getTile: function(xt, yt) {
		// if (d_lastX != xt || d_lastY != yt) {
		// 	d_lastX = xt;
		// 	d_lastY = yt;

		// 	console.log("tile @ xt="+xt+" /yt="+yt+" tile:"+this.map[yt][xt]);
		// }
		return gTileLibrary[this.map[yt][xt].id];
	},

	bumpedInto: function(level, xt, yt, entity) {
		for (var i = 0; i < this.towns.length; i++) {
			if (this.towns[i].isInTown(xt, yt, 0)) {
				this.towns[i].enter();
			} else {
				this.towns[i].leave();
			}
		}
	},
});
