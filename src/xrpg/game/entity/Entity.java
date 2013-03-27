package xrpg.game.entity;

import java.io.IOException;

import xrpg.game.Screen;
import xrpg.game.entity.Player.Direction;
import xrpg.game.level.tile.Tile;

public abstract class Entity {
	public boolean m_remove = false;
	
	public abstract void render(Screen screen, int xScroll, int yScroll) throws IOException;	
	
	protected void hurt(int damage, Direction pushDirection) { }

	protected void die() {
		m_remove = true;
	}

	public void tick() { }
	public void hurt(Tile tile, int x, int y, int damage) { }
	public void hurt(Entity entity, int x, int y, int damage) { }

}
