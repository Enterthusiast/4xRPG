
WaterTile = Tile.extend({
	sprite: 'water.png',

	mayPass: function(level, xt, yt, entity) {
		return false;
	}
});