package xrpg.game.entity;

import java.io.IOException;

import xrpg.game.InputHandler;
import xrpg.game.Screen;
import xrpg.game.Screen.RenderPosition;
import xrpg.game.level.Level;

public class Player extends Entity {
	private static final int SPEED_WALK = 2;
	private static final int SPEED_RUN = 4;
	
	private String[][] m_sprites = {
				{ "char_down_still.png", "char_down_move1.png", "char_down_move2.png", "char_down_move1.png" },
				{ "char_up_still.png", "char_up_move1.png", "char_up_move2.png", "char_up_move1.png" },
				{ "char_left_still.png", "char_left_move1.png", "char_left_move2.png", "char_left_move1.png" },
				{ "char_right_still.png", "char_right_move1.png", "char_right_move2.png", "char_right_move1.png" }
			};
	
	enum Direction {
		DOWN(0),
		UP(1),
		LEFT(2),
		RIGHT(3);
		
		int m_v;
		
		Direction(int value) {
			m_v = value;
		}
	}
	
	private int m_spawnX = 0;
	private int m_spawnY = 0;
	
	public int m_x = 0;
	public int m_y = 0;
	
	public int m_xr = 10;
	public int m_yr = 15;
	
	private int m_walkDist = 0;
	private Direction m_dir = Direction.DOWN;
	private Level m_level;
	private InputHandler m_input;
	
	public Player(Level level, InputHandler input, int x, int y) {
		m_level = level;
		m_input = input;
		
		spawn(x, y);
		
		m_level.addEntity(this);
		
		System.out.println("Spawned player @ " + m_spawnX + "," + m_spawnY);
	}
	
	private void spawn(int x, int y) {
		int xt = x >> 5;
		int yt = y >> 5;
		
		while (!m_level.getTile(xt, yt).mayPass(m_level, xt, yt, this)) {
			int dir = (int)(m_level.m_random.nextInt(4));

			if (dir == 0) xt++;
			if (dir == 1) xt--;
			if (dir == 2) yt++;
			if (dir == 3) yt--;
		}

		m_x = xt << 5;
		m_spawnX = m_x;
		m_y = yt << 5;
		m_spawnY = m_y;
	}
	
	private boolean move(int xa, int ya) {
		// While moving in both direction, reduce the speed vector.
		if (xa != 0 && ya != 0) {
			if (xa < 0) xa++;
			if (xa > 0) xa--;
			if (ya < 0) ya++;
			if (ya > 0) ya--;
		}

		if (xa != 0 || ya != 0) {
			m_walkDist++;
			if (xa < 0) m_dir = Direction.LEFT;
			if (xa > 0) m_dir = Direction.RIGHT;
			if (ya < 0) m_dir = Direction.UP;
			if (ya > 0) m_dir = Direction.DOWN;

			boolean stopped = true;
			if (xa != 0 && moveTo(xa, 0)) stopped = false;
			if (ya != 0 && moveTo(0, ya)) stopped = false;

			if (!stopped) {
				int xt = m_x >> 5;
				int yt = m_y >> 5;
				m_level.getTile(xt, yt).steppedOn(m_level, xt, yt, this);
			}

			return !stopped;
		}

		return true;
	}
	
	private boolean moveTo(int xa, int ya) {
		if (xa != 0 && ya != 0) {
			throw new UnsupportedOperationException("moveTo can only move one axis at a time !");
		}

		int xto0 = (m_x - m_xr + 16) >> 5;
		int yto0 = (m_y - m_yr + 16) >> 5;
		int xto1 = (m_x + m_xr + 16) >> 5;
		int yto1 = (m_y + m_yr + 16) >> 5;

		int xt0 = ((m_x + xa) - m_xr + 16) >> 5;
		int yt0 = ((m_y + ya) - m_yr + 16) >> 5;
		int xt1 = ((m_x + xa) + m_xr + 16) >> 5;
		int yt1 = ((m_y + ya) + m_yr + 16) >> 5;

		for (int yt = yt0; yt <= yt1; yt++) {
			for (int xt = xt0; xt <= xt1; xt++) {
				if (xt >= xto0 && xt <= xto1 && yt >= yto0 && yt <= yto1) continue;
				m_level.bumpedInto(xt, yt, this);
				if (!m_level.getTile(xt, yt).mayPass(m_level, xt, yt, this)) {
					// System.out.println(this.level.getTile(xt, yt).name+" @ "+xt+","+yt+" /p @ "+(m_x >> 5)+","+(m_y >> 5));
					return false;
				}
			}
		}

		m_x += xa;
		m_y += ya;

		// System.out.println("x:"+m_x+" /y:"+m_y+" /xa:"+xa+" /ya:"+ya);

		return true;
	}
	
	public void tick() {
		int xa = 0;
		int ya = 0;
		
		int moveUnit = SPEED_WALK;

		if (m_input.m_run.m_down) moveUnit = SPEED_RUN;
		if (m_input.m_up.m_down) ya -= moveUnit;
		if (m_input.m_down.m_down) ya += moveUnit;
		if (m_input.m_left.m_down) xa -= moveUnit;
		if (m_input.m_right.m_down) xa += moveUnit;

		this.move(xa, ya);
	}
	
	public void render(Screen screen, int xScroll, int yScroll) throws IOException {
		int tile = ((m_walkDist >> 3) % m_sprites[m_dir.m_v].length);

		screen.render(m_sprites[m_dir.m_v][tile], Screen.W / 2, Screen.H / 2);

		screen.renderDebugText("player @ "+m_x+" ("+(m_x>>5)+"),"+m_y+" ("+(m_y>>5)+")", RenderPosition.TOP_RIGHT);
	}
}
