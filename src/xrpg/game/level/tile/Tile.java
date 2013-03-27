package xrpg.game.level.tile;

import java.io.IOException;

import xrpg.game.Screen;
import xrpg.game.entity.Entity;
import xrpg.game.level.Level;

public abstract class Tile {
	protected static Tile[] ms_tiles = new Tile[256]; 
	
	public static Tile ms_dirt = new DirtTile((char)0, 2);
	public static Tile ms_grass = new GrassTile((char)1, 3);
	public static Tile ms_rock = new RockTile((char)2, 4);
	public static Tile ms_sand = new SandTile((char)3, 1);
	public static Tile ms_water = new WaterTile((char)4, 0);
	public static Tile ms_tree = new TreeTile((char)5, 4);
	public static Tile ms_cactus = new CactusTile((char)6, 4);
	protected String m_sprite = "";

	public char m_tileId;

	@SuppressWarnings("unused")
	private int m_layer = -1;
	
	public static Tile getTile(int tileId) {
		return ms_tiles[tileId];
	}
	
	public Tile(char tileId, int layer) {
		Tile.ms_tiles[tileId] = this;

		m_tileId = tileId;
		m_layer = layer;
	}

	public void render(Screen screen, int x, int y) throws IOException {
		screen.render(m_sprite, x, y);
	}
	
	public void steppedOn(Level level, int xt, int yt, Entity entity) {
		
	}
	
	public boolean mayPass(Level level, int xt, int yt, Entity entity) {
		return true;
	}
}
