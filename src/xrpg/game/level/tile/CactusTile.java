package xrpg.game.level.tile;

public class CactusTile extends Tile {
	private static final byte DAMAGE = 1;

	public CactusTile(byte tileId, int layer) {
		super(tileId, layer, DAMAGE);
		
		m_sprite = "cactus.png";
	}
}
