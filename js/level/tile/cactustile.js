
CactusTile = Tile.extend({
	sprite: 'cactus.png',

	mayPass: function(level, xt, yt, entity) {
		return false;
	}
});
