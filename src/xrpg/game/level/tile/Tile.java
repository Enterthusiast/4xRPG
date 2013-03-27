package xrpg.game.level.tile;

import java.io.IOException;

import xrpg.game.Screen;
import xrpg.game.entity.Entity;
import xrpg.game.level.Level;

public abstract class Tile {
	protected static Tile[] ms_tiles = new Tile[256]; 
	
	public static Tile ms_dirt = new DirtTile((byte)0, 2);
	public static Tile ms_grass = new GrassTile((byte)1, 3);
	public static Tile ms_rock = new RockTile((byte)2, 4);
	public static Tile ms_sand = new SandTile((byte)3, 1);
	public static Tile ms_water = new WaterTile((byte)4, 0);
	public static Tile ms_tree = new TreeTile((byte)5, 4);
	public static Tile ms_cactus = new CactusTile((byte)6, 4);
	protected String m_sprite = "";

	public byte m_tileId;
	public byte m_damage;
	
	protected boolean m_cornerTile = false;
	protected int m_layer = -1;
	
	public static Tile getTile(int tileId) {
		return ms_tiles[tileId];
	}
	
	public Tile(byte tileId, int layer) {
		this(tileId, layer, (byte)0);
	}
	
	public Tile(byte tileId, int layer, byte damage) {
		Tile.ms_tiles[tileId] = this;

		m_tileId = tileId;
		m_layer = layer;
		m_damage = damage;
	}

	public void render(Screen screen, int x, int y, byte corner) throws IOException {
		if (m_cornerTile) {
			screen.render(m_sprite, x, y, corner);
		} else {
			screen.render(m_sprite, x, y);
		}
	}
	
	public void steppedOn(Level level, int xt, int yt, Entity entity) {
		
	}
	
	public void bumpedInto(Level level, int xt, int yt, Entity entity) {
		if (m_damage != 0) {
			entity.hurt(this, xt, yt, m_damage);
		}
	}
	
	public boolean mayPass(Level level, int xt, int yt, Entity entity) {
		return true;
	}
}
