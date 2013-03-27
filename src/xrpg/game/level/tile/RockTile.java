package xrpg.game.level.tile;

import xrpg.game.entity.Entity;
import xrpg.game.level.Level;

public class RockTile extends Tile {

	public RockTile(char tileId, int layer) {
		super(tileId, layer);

		m_sprite = "rock.png";
	}
	
	@Override
	public boolean mayPass(Level level, int xt, int yt, Entity entity) {
		return false;
	}
}
