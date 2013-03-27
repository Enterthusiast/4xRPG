package xrpg.game.level.tile;

public class CactusTile extends Tile {
	private static final char DAMAGE = 1;

	public CactusTile(char tileId, int layer) {
		super(tileId, layer, DAMAGE);
		
		m_sprite = "cactus.png";
	}
}
