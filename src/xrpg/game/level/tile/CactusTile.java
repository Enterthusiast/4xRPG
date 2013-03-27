package xrpg.game.level.tile;

import xrpg.game.entity.Entity;
import xrpg.game.level.Level;

public class CactusTile extends Tile {

	public CactusTile(char tileId, int layer) {
		super(tileId, layer);
		
		m_sprite = "cactus.png";
	}
	
	@Override
	public boolean mayPass(Level level, int xt, int yt, Entity entity) {
		return false;
	}
}
