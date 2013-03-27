package xrpg.game;

import java.io.IOException;

import org.lwjgl.LWJGLException;
import org.lwjgl.Sys;
import org.lwjgl.opengl.Display;
import org.lwjgl.opengl.DisplayMode;
import org.lwjgl.opengl.GL11;

import xrpg.game.entity.Player;
import xrpg.game.level.Level;

public class Xrpg implements Runnable {
	private static final int FRAMERATE = 60;
	
	public static final int MAP_W = 200;
	public static final int MAP_H = 200;
	public static final String MAP_SEED = "ash and dust";
	
	public static final double NS_PER_TICK = 1000000000.0 / FRAMERATE;
	public static final double MS_PER_TICK = 1000.0 / FRAMERATE;
	
	private boolean m_running = false;
	private int m_currentFps = 0;
	private long m_lastFPSTime = 0;
	@SuppressWarnings("unused")
	private long m_tickCount = 0;
	@SuppressWarnings("unused")
	private long m_gameTime = 0;
	private long m_lastFrame = 0;
	
	private Screen m_screen;
	private InputHandler m_inputHandler;
	private Level m_level;
	private Player m_player;
	
	public float x = Screen.XTILES * Screen.TILESIZE / 2;
	public float y = Screen.YTILES * Screen.TILESIZE / 2;
	public float rotation = 0;
	
	public void start() {
		m_running = true;
		new Thread(this).start();
	}
	
	public Xrpg(String seed) {
		m_screen = new Screen();
		m_inputHandler = new InputHandler();
		m_level = new Level(MAP_W, MAP_H, MAP_SEED);
		m_player = new Player(m_level, m_inputHandler, (MAP_W * Screen.TILESIZE) / 2, (MAP_H * Screen.TILESIZE) / 2);
	}
	
	private boolean hasFocus() {
		// todo
		return true;
	}
	
	private void renderFocusGUI() {
		// todo
	}
	
	private void tick(int delta) {
		m_tickCount++;
		
		if (!hasFocus()) {
			m_inputHandler.releaseAll();
		} else {
			m_gameTime++;
			
			m_inputHandler.tick();
			m_level.tick();
			m_screen.tick();
		}
	}
	
	private void render() throws IOException {
		int xScroll = m_player.m_x - (Screen.W / 2);
		int yScroll = m_player.m_y - (Screen.H / 2);
		
		m_inputHandler.pollInput();

		m_screen.clearBackground();

		m_level.renderBackground(m_screen, xScroll, yScroll);
		m_level.renderSprites(m_screen, xScroll, yScroll, m_player);

		m_screen.renderJobs();
		
		// m_level.renderMinimap(this.screen, xScroll, yScroll);

		// m_screen.renderAnnouncementText("text", "subText", 1.0f);
		
		if (!this.hasFocus()) {
			renderFocusGUI();
		}
	}
	
	private void initializeDisplay() {
		try {
			Display.setDisplayMode(new DisplayMode(Screen.XTILES * Screen.TILESIZE, Screen.YTILES * Screen.TILESIZE));
			Display.create();
		} catch (LWJGLException e) {
			e.printStackTrace();
			System.exit(0);
		}
		
		GL11.glMatrixMode(GL11.GL_PROJECTION);
		GL11.glLoadIdentity();
		GL11.glOrtho(0,  Screen.XTILES * Screen.TILESIZE,  Screen.YTILES * Screen.TILESIZE, 0, 1, -1);
		GL11.glMatrixMode(GL11.GL_MODELVIEW);
		
		GL11.glEnable(GL11.GL_BLEND);
		GL11.glBlendFunc(GL11.GL_SRC_ALPHA, GL11.GL_ONE_MINUS_SRC_ALPHA);
		
		m_screen.preloadFonts();
	}
	
	public long getTime() {
		return (Sys.getTime() * 1000) / Sys.getTimerResolution();
	}
	
	public int getDelta() {
		long time = getTime();
		int delta = (int) (time - m_lastFrame);
		m_lastFrame = time;
		
		return delta;
	}
	
	public void updateFPS() {
		if (getTime() - m_lastFPSTime > 1000) {
			Display.setTitle(m_currentFps + " fps");
			m_currentFps = 0;
			m_lastFPSTime += 1000;
		}

		m_currentFps++;		
	}
	
	public void run() {
		getDelta();
		m_lastFPSTime = getTime();
		
		initializeDisplay();

		try {
			while (m_running && !Display.isCloseRequested()) {
				int delta = getDelta();
				
				tick(delta);
				updateFPS();
				render();
	
				Display.update();
				Display.sync(FRAMERATE);
			}
		} catch (IOException e) {
			e.printStackTrace();
		}
		
		Display.destroy();
	}

	public static void main(String[] args) {
		Xrpg xrpg = new Xrpg(MAP_SEED);

		xrpg.start();
	}

}
