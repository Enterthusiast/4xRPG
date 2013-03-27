package xrpg.game.level.tile;

public class SandTile extends Tile {

	public SandTile(byte tileId, int layer) {
		super(tileId, layer);

		m_sprite = "sand.png";
		m_cornerTile = true;
	}

}
