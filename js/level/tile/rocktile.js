
RockTile = Tile.extend({
	sprite: 'rock.png',

	mayPass: function(level, xt, yt, entity) {
		return false;
	}
});