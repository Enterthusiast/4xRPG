
var FREQUENCY = 1;
var OCTAVES = 16;

LevelGen = Class.extend({
	w: 0,
	h: 0,
	seed: null,

	// Simple smoothing method, gets rid of unwanted blurps
	smooth: function() {
var rockCount = 0;
var grassCount = 0;
var sandCount = 0;
var waterCount = 0;
		for (var y = 0; y < this.h; y++) {
			for (var x = 0; x < this.w; x++) {
				var average = 0;
				var times = 0;

				if (x - 1 >= 0) {
					average += this.map[y][x - 1];
					times++;
				}
				if (x + 1 < this.w - 1) {
					average += this.map[y][x + 1];
					times++;
				}
				if (y - 1 >= 0) {
					average += this.map[y - 1][x];
					times++;
				}
				if (y + 1 < this.h - 1) {
					average += this.map[y + 1][x];
					times++
				}

				if (x - 1 >= 0 && y - 1 >= 0) {
					average += this.map[y - 1][x - 1];
					times++;
				}
				if (x + 1 < this.w && y - 1 >= 0) {
					average += this.map[y - 1][x + 1];
					times++;
				}
				if (x - 1 >= 0 && y + 1 < this.h) {
					average += this.map[y + 1][x - 1];
					times++;
				}
				if (x + 1 < this.w && y + 1 < this.h) {
					average += this.map[y + 1][x + 1];
					times++
				}

				average += this.map[y][x];
				times++;

				average /= times;

				if (average >= 60) {
					this.map[y][x] = gTileLibrary['rock'].id;
					rockCount++;
				} else if (average >= 30) {
					this.map[y][x] = gTileLibrary['grass'].id;
					grassCount++;	
				} else if (average >= 10) {
					this.map[y][x] = gTileLibrary['sand'].id;
					sandCount++;	
				} else {
					this.map[y][x] = gTileLibrary['water'].id;
					waterCount++;						
				}
			}
		}
				
				console.log("map total :\n\t"+rockCount+" rock / "+grassCount+" grass / "+sandCount+" sand / "+waterCount+" water");
	},

	createIsland: function(w, h) {
		this.map = gPerlinNoiseGen.generateNoise(w, h, FREQUENCY, OCTAVES);

		this.w = w;
		this.h = h;

		var particleMap = [];
		for (var y = 0; y < this.h; y++) {
			var row = [];
			for (var x = 0; x < this.w; x++) {
				row[x] = 0;
			}
			particleMap[y] = row;
		}

		for (var i = 0; i < Math.floor(w * h * 0.85); i++) {
			var x = 15 + Math.floor(Math.random() * (this.w - 33));
			var y = 15 + Math.floor(Math.random() * (this.h - 33));
			// console.log("i="+i+" x="+x+" y="+y);
			for (var j = 0; j < Math.floor(w * h * 0.05); j++) {
				particleMap[y][x] += 7;

				if (particleMap[y][x] >= 255) {
					particleMap[y][x] = 255;
				}

				var currentValue  = particleMap[y][x];
				var choices = [];

				if (x - 1 > 0) {
					if (particleMap[y][x - 1] <= currentValue) {
						choices.push('left');
					}
				}
				if (x + 1 < this.w - 1) {
					if (particleMap[y][x + 1] <= currentValue) {
						choices.push('right');
					}
				}
				if (y - 1 > 0) {
					if (particleMap[y - 1][x] <= currentValue) {
						choices.push('up');
					}
				}
				if (y + 1 < this.w - 1) {
					if (particleMap[y + 1][x] <= currentValue) {
						choices.push('down');
					}
				}

				if (choices.length == 0) {
					break;
				}

				var actualChoice = choices[Math.floor(Math.random() * 4)];
				if (actualChoice == 'left') {
					x -= 1;
				} else if (actualChoice == 'right') {
					x += 1;
				} else if (actualChoice == 'up') {
					y -= 1;
				} else if (actualChoice == 'down') {
					y += 1;
				}
			}
		}

		for (var y = 0; y < this.h; y++) {
			for (var x = 0; x < this.w; x++) {
				// console.log("x="+x+" y="+y+" particleMap[y][x]="+particleMap[y][x]);
				this.map[y][x] *= particleMap[y][x] / 255;
			}
		}

		this.smooth();

		return this.map;
	},

	createSurfaceMap: function(w, h) {
		var attempt = 0;

		do {
			var result = this.createIsland(w, h);

			return result;
		} while (true);
	}
});
