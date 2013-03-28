package xrpg.game.level.tile;

import java.io.IOException;

import xrpg.game.Screen;
import xrpg.game.entity.Entity;
import xrpg.game.level.Level;

public abstract class Tile {
	protected static Tile[] ms_tiles = new Tile[256]; 

	public static Tile ms_water = new WaterTile((byte)0, 0);
	public static Tile ms_sand = new SandTile((byte)1, 1);
	public static Tile ms_dirt = new DirtTile((byte)2, 2);
	public static Tile ms_grass = new GrassTile((byte)3, 3);
	public static Tile ms_rock = new RockTile((byte)4, 4);
	public static Tile ms_tree = new TreeTile((byte)5, 4);
	public static Tile ms_cactus = new CactusTile((byte)6, 4);

	protected String m_subSprite = "";
	protected String m_sprite = "";

	public byte m_tileId;
	public byte m_damage;
	
	public boolean[] m_connectsTo = new boolean[Byte.SIZE];
	
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

	public void render(Screen screen, Level level, int xt, int yt) throws IOException {
		if (m_cornerTile) {
			screen.render(m_sprite, xt * Screen.TILESIZE, yt * Screen.TILESIZE, Screen.CORNER_FULL);
		} else {
			screen.render(m_sprite, xt * Screen.TILESIZE, yt * Screen.TILESIZE);
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
	
	public static byte getCornerMapValue(byte[][] tileMap, int xt, int yt, byte tileId) {
		boolean upConnects = Tile.getTile(tileMap[yt - 1][xt]).m_connectsTo[tileId];
		boolean downConnects = Tile.getTile(tileMap[yt + 1][xt]).m_connectsTo[tileId];
		boolean leftConnects = Tile.getTile(tileMap[yt][xt - 1]).m_connectsTo[tileId];
		boolean rightConnects = Tile.getTile(tileMap[yt][xt + 1]).m_connectsTo[tileId];
		boolean upLeftConnects = Tile.getTile(tileMap[yt - 1][xt - 1]).m_connectsTo[tileId];
		boolean upRightConnects = Tile.getTile(tileMap[yt - 1][xt + 1]).m_connectsTo[tileId];
		boolean downLeftConnects = Tile.getTile(tileMap[yt + 1][xt - 1]).m_connectsTo[tileId];
		boolean downRightConnects = Tile.getTile(tileMap[yt + 1][xt + 1]).m_connectsTo[tileId];
		
		byte corner = Screen.CORNER_EMPTY;
		if (leftConnects && rightConnects && upConnects && downConnects) {
			if (upLeftConnects && upRightConnects && downLeftConnects && downRightConnects) {
				corner = Screen.CORNER_FULL;
			} else if (downLeftConnects && downRightConnects) {
				if (upRightConnects) {
					corner = Screen.CORNER_FULL_BOTTOM_RIGHT;
				} else if (upLeftConnects) {
					corner = Screen.CORNER_FULL_BOTTOM_LEFT;
				} else {
					corner = Screen.CORNER_BOTTOM;
				}
			} else if (upLeftConnects && upRightConnects) {
				if (downRightConnects) {
					corner = Screen.CORNER_FULL_TOP_RIGHT;
				} else if (downLeftConnects) {
					corner = Screen.CORNER_FULL_TOP_LEFT;
				} else {
					corner = Screen.CORNER_TOP;
				}
			} else if (upLeftConnects && downLeftConnects) {
				corner = Screen.CORNER_LEFT;
			} else if (upRightConnects && downRightConnects) {
				corner = Screen.CORNER_RIGHT;
			} else if (upRightConnects && downLeftConnects) {
				corner = Screen.CORNER_SLASH;
			} else if (upLeftConnects && downRightConnects) {
				corner = Screen.CORNER_ANTISLASH;
			} else if (downLeftConnects) {
				corner = Screen.CORNER_BOTTOM_LEFT;
			} else if (downRightConnects) {
				corner = Screen.CORNER_BOTTOM_RIGHT;
			} else if (upLeftConnects) {
				corner = Screen.CORNER_TOP_LEFT;
			} else if (upRightConnects) {
				corner = Screen.CORNER_TOP_RIGHT;
			}
		} else if (leftConnects && rightConnects) {
			if (upConnects) {
				if (upLeftConnects && upRightConnects) {
					corner = Screen.CORNER_TOP;
				} else if (upLeftConnects) {
					corner = Screen.CORNER_TOP_LEFT;
				} else if (upRightConnects) {
					corner = Screen.CORNER_TOP_RIGHT;
				}
			} else  if (downConnects) {
				if (downLeftConnects && downRightConnects) {
					corner = Screen.CORNER_BOTTOM;
				} else if (downLeftConnects) {
					corner = Screen.CORNER_BOTTOM_LEFT;
				} else if (downRightConnects) {
					corner = Screen.CORNER_BOTTOM_RIGHT;
				}
			}
		} else if (upConnects && downConnects) {
			if (leftConnects) {
				if (upLeftConnects && downLeftConnects) {
					corner = Screen.CORNER_LEFT;
				} else if (upLeftConnects) {
					corner = Screen.CORNER_TOP_LEFT;
				} else if (downLeftConnects) {
					corner = Screen.CORNER_BOTTOM_LEFT;
				}
			} else if (rightConnects) {
				if (upRightConnects && downRightConnects) {
					corner = Screen.CORNER_RIGHT;
				} else if (upRightConnects) {
					corner = Screen.CORNER_TOP_RIGHT;
				} else if (downRightConnects) {
					corner = Screen.CORNER_BOTTOM_RIGHT;
				}
			}
		} else if (leftConnects) {
			if (upConnects && upLeftConnects) {
				corner = Screen.CORNER_TOP_LEFT;
			} else if (downConnects && downLeftConnects) {
				corner = Screen.CORNER_BOTTOM_LEFT;
			}
		} else if (rightConnects) {
			if (upConnects && upRightConnects) {
				corner = Screen.CORNER_TOP_RIGHT;
			} else if (downConnects && downRightConnects) {
				corner = Screen.CORNER_BOTTOM_RIGHT;
			}
		}
//		corner = Screen.CORNER_FULL;
		return corner;
	}
}
