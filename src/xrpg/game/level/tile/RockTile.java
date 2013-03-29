package xrpg.game.level.tile;

import java.io.IOException;

import xrpg.game.Screen;
import xrpg.game.entity.Entity;
import xrpg.game.level.Level;

public class RockTile extends Tile {

	public RockTile(byte tileId, int layer) {
		super(tileId, layer);

		m_sprite = "rock.png";
		m_cornerTile = true;
		m_connectsTo[Tile.ms_grass.m_tileId] = true;
		m_connectsTo[tileId] = true;
	}
	
	@Override
	public boolean mayPass(Level level, int xt, int yt, Entity entity) {
		return Tile.getCornerMapValue(level.m_map, xt, yt, m_tileId) == Screen.CORNER_EMPTY;
	}

	@Override
	public void render(Screen screen, Level level, int xt, int yt) throws IOException {		
		screen.render(Tile.ms_grass.m_sprite, xt * Screen.TILESIZE, yt * Screen.TILESIZE, Screen.CORNER_FULL);
		screen.render(m_sprite, xt * Screen.TILESIZE, yt * Screen.TILESIZE, Tile.getCornerMapValue(level.m_map, xt, yt, m_tileId));
	}
}
