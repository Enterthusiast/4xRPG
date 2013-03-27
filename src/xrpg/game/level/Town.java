package xrpg.game.level;

import java.util.Random;

import org.newdawn.slick.Color;

import xrpg.game.NameGen;
import xrpg.game.Screen;
import xrpg.game.Xrpg;

public class Town {
	public static final int CHEST_CAPACITY_DEFAULT = 500;
	public static final int CHEST_CAPACITY_STEP = 50;
	public static final int CHEST_CAPACITY_VAR = 5;
	public static final int CHEST_COUNTER_MS = 30000;
	public static final int TITLE_DISPLAY_TIME_MS = 3000;
	public static final int CONQUER_DISPLAY_TIME_MS = 5000;
	public static final int CONQUER_TIME_MS = 10000;
	
	public enum State {
		Hostile,
		Friendly,
		Conquered;
	}
	
	public class Chest {
		public int m_capacity = 0;
		public int m_amount = 0;
		public int m_counter = 0;
	}
	
	public enum EntityState {
		Out,
		In;		
	}
	
	public int m_id = 0;
	public String m_name = "";
	public State m_state = State.Hostile;
	public Chest m_chest = new Chest();
	
	public boolean m_territoryAnnounce = false;
	public boolean m_conquerAnnounce = false;
	public EntityState m_entered = EntityState.Out;
	public int m_conquerCounter = CONQUER_TIME_MS;
	public int m_xt = 0;
	public int m_yt = 0;
	public int m_w = 21;
	public int m_h = 13;
	
	public int m_top = 0;
	public int m_bottom = 0;
	public int m_left = 0;
	public int m_right = 0;

	public Town(int id, int xt, int yt, Random random) {
		m_xt = xt;
		m_yt = yt;
		m_id = id;
		m_name = NameGen.getRandomName(random);
		m_chest.m_capacity = (int)random.nextInt(CHEST_CAPACITY_DEFAULT) + ((int)random.nextInt(CHEST_CAPACITY_VAR) * CHEST_CAPACITY_STEP);

		m_top = Math.round(yt - m_h / 2);
		m_bottom = m_top + m_h;
		m_left = Math.round(xt - m_w / 2);
		m_right = m_left + m_w;
		
		System.out.println("Spawned town '" + m_name + "' @ " + m_xt + "," + m_yt);
	}

	public void tick() {
		if (m_state == State.Conquered) {
			m_chest.m_counter += Xrpg.MS_PER_TICK;
			if (m_chest.m_counter > CHEST_COUNTER_MS && m_chest.m_amount < m_chest.m_capacity) {
				m_chest.m_amount++;
				m_chest.m_counter = 0;
			}
		}
		
		if (m_state == State.Hostile) {
			if (m_entered == EntityState.In) {
				m_conquerCounter -= Xrpg.MS_PER_TICK;
				
				if (m_conquerCounter <= 0) {
					m_state = State.Conquered;
					m_conquerAnnounce = true;
				}
			}
		}
	}

	public boolean isInTown(int x0, int y0, int radius) {
		if (x0 >= m_left - radius && x0 < m_right + radius && y0 >= m_top - radius && y0 < m_bottom + radius) {
			return true;
		}

		return false;
	}

	public void enter() {
		if (m_entered != EntityState.In) {
			m_territoryAnnounce = true;
		}
		m_entered = EntityState.In;
	}

	public void leave() {
		m_entered = EntityState.Out;
		
		if (m_state != State.Conquered) {
			m_conquerCounter = CONQUER_TIME_MS;
		}
	}

	public void render(Screen screen, int playerX, int playerY) {
		// screen.renderDebugText(this.name + " " + this.entered, 'bottom-left');

		if (m_conquerAnnounce) {
			m_conquerAnnounce = false;
			screen.addAnnouncementJob(m_name + " conquered !", "You can now access this town's chest.", CONQUER_DISPLAY_TIME_MS, Color.white);
		}
		if (m_territoryAnnounce) {
			m_territoryAnnounce = false;
			screen.addAnnouncementJob(m_name, m_state.toString() + " territory", TITLE_DISPLAY_TIME_MS);
		}
	}
}
