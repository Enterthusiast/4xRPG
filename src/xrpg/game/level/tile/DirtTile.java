package xrpg.game.level.tile;

public class DirtTile extends Tile {

	public DirtTile(byte tileId, int layer) {
		super(tileId, layer);

		m_sprite = "dirt.png";
		m_cornerTile = true;
	}

}
