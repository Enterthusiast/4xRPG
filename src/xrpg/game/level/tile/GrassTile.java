package xrpg.game.level.tile;

public class GrassTile extends Tile {

	public GrassTile(byte tileId, int layer) {
		super(tileId, layer);

		m_sprite = "grass.png";
		m_cornerTile = true;
	}

}
