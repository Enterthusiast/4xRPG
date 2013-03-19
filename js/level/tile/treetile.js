
TreeTile = Tile.extend({
	sprite: 'tree.png',

	mayPass: function(level, xt, yt, entity) {
		return false;
	}
});