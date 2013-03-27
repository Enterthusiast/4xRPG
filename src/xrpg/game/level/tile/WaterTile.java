package xrpg.game.level.tile;

import xrpg.game.entity.Entity;
import xrpg.game.level.Level;

public class WaterTile extends Tile {

	public WaterTile(byte tileId, int layer) {
		super(tileId, layer);

		m_sprite = "water.png";
		m_cornerTile = true;
	}
	
	@Override
	public boolean mayPass(Level level, int xt, int yt, Entity entity) {
		return false;
	}
}
