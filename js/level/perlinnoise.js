
PerlinNoiseGen = Class.extend({

    noise: [],
    noiseWidth: 0,
    noiseHeight: 0,

    init: function() {
    },

    // Generates a smoothed up perlin noise 2d map.
    generateNoise: function(w, h, frequency, octaves) {
        this.noiseWidth = w;
        this.noiseHeight = h;

        for (var y = 0; y < this.noiseHeight; y++) {
            var noiseRow = new Array();
            for (var x = 0; x < this.noiseWidth; x++) {
                noiseRow[x] = Math.random();
            }
            this.noise[y] = noiseRow;
        }

        var result = [];
        for (var y = 0; y < this.noiseHeight; y++) {
            var row = [];
            for (var x = 0; x < this.noiseWidth; x++) {
                row[x] = this.turbulence(x * frequency, y * frequency, octaves);
                // console.log("row[x]="+row[x]);
            }
            result[y] = row;
        }

        return result;
    },

    // Gives the average value for the neighbours of the given location.
    smooth: function(x, y) {
        var fractX = x - Math.floor(x);
        var fractY = y - Math.floor(y);

        var x1 = (Math.floor(x) + this.noiseWidth) % this.noiseWidth;
        var y1 = (Math.floor(y) + this.noiseHeight) % this.noiseHeight;

        var x2 = (x1 + this.noiseWidth - 1) % this.noiseWidth;
        var y2 = (y1 + this.noiseHeight - 1) % this.noiseHeight;

        var value = 0.0;
        value += fractX       * fractY       * this.noise[y1][x1];
        value += fractX       * (1 - fractY) * this.noise[y2][x1];
        value += (1 - fractX) * fractY       * this.noise[y1][x2];
        value += (1 - fractX) * (1 - fractY) * this.noise[y2][x2];

        return value;
    },

    // Controls the blur of the map.
    turbulence: function(x, y, size) {
        var value = 0.0;
        var initialSize = size;

        while (size >= 1) {
            value += this.smooth(x / size, y / size) * size;
            size /= 2.0;
        }

        // console.log("[t] value = " + value + " / initialSize = " + initialSize);
        return (128.0 * value / initialSize);
    }
});

var gPerlinNoiseGen = new PerlinNoiseGen();
