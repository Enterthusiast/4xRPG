package xrpg.game.level.tile;

import xrpg.game.entity.Entity;
import xrpg.game.level.Level;

public class TreeTile extends Tile {

	public TreeTile(byte tileId, int layer) {
		super(tileId, layer);

		m_sprite = "tree.png";
		m_connectsTo[Tile.ms_grass.m_tileId] = true;
		m_connectsTo[Tile.ms_sand.m_tileId] = true;
	}
	
	@Override
	public boolean mayPass(Level level, int xt, int yt, Entity entity) {
		return false;
	}
}
