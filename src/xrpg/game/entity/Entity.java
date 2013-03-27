package xrpg.game.entity;

import java.io.IOException;

import xrpg.game.Screen;

public abstract class Entity {
	
	public abstract void render(Screen screen, int xScroll, int yScroll) throws IOException;
	public abstract void tick();

}
