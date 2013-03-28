package xrpg.game.level.tile;

import xrpg.game.entity.Entity;
import xrpg.game.level.Level;

public class CactusTile extends Tile {
	private static final byte DAMAGE = 1;

	public CactusTile(byte tileId, int layer) {
		super(tileId, layer, DAMAGE);
		
		m_sprite = "cactus.png";
		m_connectsTo[Tile.ms_sand.m_tileId] = true;
	}
	
	@Override
	public boolean mayPass(Level level, int xt, int yt, Entity entity) {
		return false;
	}
}
