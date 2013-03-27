package xrpg.game.level;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

import xrpg.game.Screen;
import xrpg.game.entity.Entity;
import xrpg.game.entity.Player;
import xrpg.game.level.tile.Tile;

public class Level {
	public Random m_random;
	public String m_seed;
	public Player m_player;
	
	public int m_w;
	public int m_h;
	
	public char[][] m_map;
	public List<Town> m_towns;
	public List<Entity> m_entities = new ArrayList<Entity>();
	
	public Level(int width, int height, String seed) {
		m_seed = seed;
		m_random = new Random(seed.hashCode());
		
		m_w = width;
		m_h = height;
		
		System.out.println("Creating level with sed: " + seed);

		m_map = LevelGen.createSurfaceMap(m_random, m_w, m_h);
		m_towns = LevelGen.getTowns(m_random, m_w, m_h, m_map);

		// for (int y = 0; y < m_w; y++) {
		// 	for (int x = 0; x < m_h; x++) {
		// 		System.out.println("this.map["+y+"]["+x+"]="+this.map[y][x]);
		// 	}
		// }
	}
	
	public boolean addEntity(Entity entity) {
		return m_entities.add(entity);
	}
	
	public void renderBackground(Screen screen, int xScroll, int yScroll) throws IOException {
		int x0 = xScroll >> 5;
		int y0 = yScroll >> 5;

		screen.setOffset(xScroll, yScroll);
		for (int y = y0; y < Screen.YTILES + y0 + 2; y++) {
			for (int x = x0; x < Screen.XTILES + x0 + 2; x++) {
				if (y < 0 || x < 0 || y >= m_h || x >= m_w) {
					Tile.ms_water.render(screen, x * Screen.TILESIZE, y * Screen.TILESIZE);
				} else {
					boolean townTile = false;
					for (Town town : m_towns) {
						if (town.isInTown(x, y, 0)) {
							townTile = true;
							break;
						}
					}
					Tile currentTile = Tile.getTile(m_map[y][x]);
					if (townTile && currentTile.mayPass(this, x, y, null)) {
						Tile.ms_dirt.render(screen, x * Screen.TILESIZE, y * Screen.TILESIZE);
					} else {
						currentTile.render(screen, x * Screen.TILESIZE, y * Screen.TILESIZE);
					}
				}
			}
		}

		screen.setOffset(0, 0);
	}

	public void generateMinimap(Screen screen) {
		// todo
	}
	
	public void renderMinimap(Screen screen, int xScroll, int yScroll) {
		// todo
	}
	
	public void renderSprites(Screen screen, int xScroll, int yScroll) throws IOException {
		for (Entity entity : m_entities) {
			entity.render(screen, xScroll, yScroll);
		}
		for (Town town : m_towns) {
			town.render(screen, m_player.m_x, m_player.m_y);
		}
	}
	
	public void tick() {
		for (int i = 0; i < m_entities.size(); i++) {
			Entity entity = m_entities.get(i);
			entity.tick();
			
			if (entity.m_remove) {
				m_entities.remove(i--);
			}
		}
		for (Town town : m_towns) {
			town.tick();
		}
	}
	
	public Tile getTile(int xt, int yt) {
		return Tile.getTile(m_map[yt][xt]);
	}

	public void bumpedInto(int xt, int yt, Entity entity) {
		if (Tile.getTile(m_map[yt][xt]).bumpedInto(this, xt, yt, entity) == false) {
			return;
		}

		for (Town town : m_towns) {
			if (town.isInTown(xt, yt, 0)) {
				town.enter();
			} else {
				town.leave();
			}
		}
	}
}
