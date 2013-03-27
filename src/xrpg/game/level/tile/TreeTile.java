package xrpg.game.level.tile;

import xrpg.game.entity.Entity;
import xrpg.game.level.Level;

public class TreeTile extends Tile {

	public TreeTile(byte tileId, int layer) {
		super(tileId, layer);

		m_sprite = "tree.png";
	}
	
	@Override
	public boolean mayPass(Level level, int xt, int yt, Entity entity) {
		return false;
	}
}
