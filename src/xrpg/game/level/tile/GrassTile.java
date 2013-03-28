package xrpg.game.level.tile;

import java.io.IOException;

import xrpg.game.Screen;
import xrpg.game.level.Level;

public class GrassTile extends Tile {

	public GrassTile(byte tileId, int layer) {
		super(tileId, layer);

		m_subSprite = Tile.ms_sand.m_sprite;
		m_sprite = "grass.png";
		m_cornerTile = true;
		m_connectsTo[tileId] = true;
		m_connectsTo[Tile.ms_sand.m_tileId] = true;
	}

	@Override
	public void render(Screen screen, Level level, int xt, int yt) throws IOException {
		byte sandLayerCorner = Tile.getCornerMapValue(level.m_map, xt, yt, Tile.ms_sand.m_tileId);

		if (sandLayerCorner != Screen.CORNER_FULL) {
			screen.render(Tile.ms_water.m_sprite, xt * Screen.TILESIZE, yt * Screen.TILESIZE, Screen.CORNER_FULL);
		}
		
		screen.render(Tile.ms_sand.m_sprite, xt * Screen.TILESIZE, yt * Screen.TILESIZE, sandLayerCorner);
		screen.render(m_sprite, xt * Screen.TILESIZE, yt * Screen.TILESIZE, Tile.getCornerMapValue(level.m_map, xt, yt, m_tileId));
	}
}
