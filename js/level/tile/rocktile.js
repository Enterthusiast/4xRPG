
RockTile = Tile.extend({
	sprite: 'rock_d.png',

	mayPass: function(level, xt, yt, entity) {
		return false;
	}
});