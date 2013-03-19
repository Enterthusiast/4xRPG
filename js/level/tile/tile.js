var gTileLibrary = []

Tile = Class.extend({
	id: -1,
	tiles: [],
	name: '',
	layer: 0,

	init: function(id, name, layer) {
		if (id == null) {
			return;
		}

		this.layer = layer;
		this.id = id;
		this.name = name;

		// console.log("New tile : " + name);

		if (gTileLibrary[name] != null) {
			throw "--- Duplicate tile id !";
		}

		gTileLibrary[this.id] = this;
		gTileLibrary[this.name] = this;
	},

	render: function(screen, x, y) {
		// console.log("Rendering "+this.name+" ("+this.sprite+") tile at "+x+" / "+y);
		screen.render(this.sprite, x, y);
	},

	steppedOn: function(level, xt, yt, entity) {

	},

	mayPass: function(level, xt, yt, entity) {
		return true;
	}
});

var gTiles = new Tile();