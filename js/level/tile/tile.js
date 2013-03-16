var gTileLibrary = []

Tile = Class.extend({
	id: -1,
	tiles: [],
	name: '',

	init: function(id, name) {
		if (id == null) {
			return;
		}

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
		// console.log("Rendering "+this.name+" tile at "+x+" / "+y);
		screen.render(this.sprite, x, y);
	},

	steppedOn: function(level, xt, yt, entity) {

	}
});

var gTiles = new Tile();