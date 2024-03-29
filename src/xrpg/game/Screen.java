package xrpg.game;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.lwjgl.opengl.GL11;
import org.newdawn.slick.Color;
import org.newdawn.slick.SlickException;
import org.newdawn.slick.UnicodeFont;
import org.newdawn.slick.font.effects.ColorEffect;
import org.newdawn.slick.opengl.Texture;
import org.newdawn.slick.opengl.TextureLoader;
import org.newdawn.slick.util.FontUtils;
import org.newdawn.slick.util.ResourceLoader;

public class Screen {

	/**
	 * Corner maps look like this:
	 *
	 * 00 10 01 11 00 10 01 11 00 10 01 11 00 10 01 11
	 * 00 00 00 00 10 10 10 10 01 01 01 01 11 11 11 11
	 * 
	 * With 0 meaning the material is invisible, & 1 meaning the material is visible.
	 */	
	public static byte CORNER_EMPTY 			= 0x00;
	public static byte CORNER_TOP_LEFT 			= 0x01;
	public static byte CORNER_TOP_RIGHT 		= 0x02;
	public static byte CORNER_TOP 				= 0x03;
	public static byte CORNER_BOTTOM_LEFT 		= 0x04;
	public static byte CORNER_LEFT 				= 0x05;
	public static byte CORNER_SLASH 			= 0x06;
	public static byte CORNER_FULL_TOP_LEFT 	= 0x07;
	public static byte CORNER_BOTTOM_RIGHT 		= 0x08;
	public static byte CORNER_ANTISLASH 		= 0x09;
	public static byte CORNER_RIGHT 			= 0x0a;
	public static byte CORNER_FULL_TOP_RIGHT 	= 0x0b;
	public static byte CORNER_BOTTOM 			= 0x0c;
	public static byte CORNER_FULL_BOTTOM_LEFT 	= 0x0d;
	public static byte CORNER_FULL_BOTTOM_RIGHT = 0x0e;
	public static byte CORNER_FULL 				= 0x0f;
	
	public static final int TILESIZE = 32;
	public static final int XTILES = 24;
	public static final int YTILES = 16;
	
	public static final int W = XTILES * TILESIZE;
	public static final int H = YTILES * TILESIZE;
	
	private int m_offsetX = 0;
	private int m_offsetY = 0;
	
	private Map<String, Texture> m_textureMap = new HashMap<String, Texture>();
	
	class Job {
		String m_text = "";
		String m_subText = "";
		long m_counter = 0;
		float m_alpha = 0;
		long m_time = 0;
		Color m_color = Color.black;
		boolean m_fadeOut = false;
		
		Job(String text, String subText, long time, Color renderColor, boolean fadeOut) {
			m_text = text;
			m_subText = subText;
			m_time = time;
			m_counter = time;
			m_color = renderColor;
			m_fadeOut = fadeOut;
		}
	}
	
	public enum Align {
		CENTER,
		LEFT,
		RIGHT;
	}
	
	private List<Job> m_jobs = new ArrayList<Job>();
	
	public enum RenderPosition {
		TOP_LEFT,
		TOP_RIGHT,
		BOTTOM_LEFT,
		BOTTOM_RIGHT;
	}
	
	private Texture getTexture(String sprite) throws IOException {
		if (!m_textureMap.containsKey(sprite)) {
			m_textureMap.put(sprite, TextureLoader.getTexture("PNG", ResourceLoader.getResourceAsStream("res/img/" + sprite)));
		}
		 
		return m_textureMap.get(sprite);
	}
	
	private void drawSpriteFromSheet(Texture sheet, int x, int y, byte corner) {
		Color.white.bind();
		sheet.bind();
		
		GL11.glBegin(GL11.GL_QUADS);
			GL11.glTexCoord2f(corner / (float)(CORNER_FULL + 1), 0);
			GL11.glVertex2f(x, y);

			GL11.glTexCoord2f((corner + 1) / (float)(CORNER_FULL + 1), 0);
			GL11.glVertex2f(x + TILESIZE, y);

			GL11.glTexCoord2f((corner + 1) / (float)(CORNER_FULL + 1), 1);
			GL11.glVertex2f(x + TILESIZE, y + TILESIZE);

			GL11.glTexCoord2f(corner / (float)(CORNER_FULL + 1), 1);
			GL11.glVertex2f(x, y + TILESIZE);
		GL11.glEnd();
	}
	
	private void drawSprite(Texture texture, int x, int y, Color bindColor) {
		bindColor.bind();
		texture.bind();
		
		GL11.glBegin(GL11.GL_QUADS);
			GL11.glTexCoord2f(0, 0);
			GL11.glVertex2f(x, y);

			GL11.glTexCoord2f(1, 0);
			GL11.glVertex2f(x + texture.getTextureWidth(), y);

			GL11.glTexCoord2f(1, 1);
			GL11.glVertex2f(x + texture.getTextureWidth(), y + texture.getTextureHeight());

			GL11.glTexCoord2f(0, 1);
			GL11.glVertex2f(x, y + texture.getTextureHeight());
		GL11.glEnd();
	}

	public void render(String sheet, int x, int y, byte corner) throws IOException {
		drawSpriteFromSheet(getTexture(sheet), x - m_offsetX, y - m_offsetY, corner);
	}

	public void render(String sprite, int x, int y) throws IOException {
		render(sprite, x, y, Color.white);
	}
	
	public void render(String sprite, int x, int y, Color bindColor) throws IOException {
		drawSprite(getTexture(sprite), x - m_offsetX, y - m_offsetY, bindColor);
	}
	
	public void setOffset(int x, int y) {
		m_offsetX = x;
		m_offsetY = y;
	}

	public void clearBackground() {
		GL11.glClear(GL11.GL_COLOR_BUFFER_BIT | GL11.GL_DEPTH_BUFFER_BIT);		
	}
	
	private Map<Integer, UnicodeFont> m_fonts = new HashMap<Integer, UnicodeFont>();
	private static final String FONT = "res/fonts/Unibody 8-Bold.ttf";
	private static final int DEBUG_FONT = 12;
	private static final int ANNOUNCEMENT_TEXT_FONT = 30;
	private static final int ANNOUNCEMENT_SUBTEXT_FONT = 20;
	
	@SuppressWarnings("unchecked")
	private UnicodeFont loadFont(int fontSize, boolean bold, boolean italic, boolean shadow) {
		UnicodeFont font = null;
		
		System.out.println("Loading font '" + FONT + "' @ size " + fontSize + "...");
		
		try {
			font = new UnicodeFont(FONT, fontSize, bold, italic);
			font.getEffects().add(new ColorEffect(java.awt.Color.white));
			if (shadow) {
				//font.getEffects().add(new ShadowEffect(java.awt.Color.black, 0, 0, 1.0f));
			}
			font.addAsciiGlyphs();
			font.loadGlyphs();
		} catch (SlickException e) {
			e.printStackTrace();
		}
		
		return font;
	}
	
	public void preloadFonts() {
		m_fonts.put(ANNOUNCEMENT_TEXT_FONT, loadFont(ANNOUNCEMENT_TEXT_FONT, true, false, true));
		m_fonts.put(ANNOUNCEMENT_SUBTEXT_FONT, loadFont(ANNOUNCEMENT_SUBTEXT_FONT, true, false, true));
		
		m_fonts.put(DEBUG_FONT, loadFont(DEBUG_FONT, true, false, false));
	}
	
	public void renderText(String text, int x, int y, Align align) {
		Color.white.bind();
		
		switch (align) {
			case CENTER:
				FontUtils.drawCenter(m_fonts.get(DEBUG_FONT), text, x,  y, 0, Color.yellow);
				break;

			case LEFT:
				m_fonts.get(DEBUG_FONT).drawString(x, y, text, Color.yellow);
				break;
				
			case RIGHT:
				FontUtils.drawRight(m_fonts.get(DEBUG_FONT), text, x,  y, 0, Color.yellow);
				break;
		}
	}
	
	public void renderDebugText(String text, RenderPosition position) {
		Color.white.bind();
		
		m_fonts.get(DEBUG_FONT).drawString(0, 0, text, Color.yellow);
	}

	public void renderAnnouncementText(String text, String subText, float progress) {
		renderAnnouncementText(text, subText, progress, Color.black, true);
	}

	public void renderAnnouncementText(String text, String subText, float progress, Color renderColor, boolean fadeOut) {
		Color.white.bind();

        float alpha = 1.0f;
        if (progress > 0.7) {
            alpha = (0.3f - (progress - 0.7f)) / 0.3f;
        } else if (progress < 0.3f && fadeOut) {
            alpha = progress / 0.3f;
        } else if (progress <= 0.0f && fadeOut) {
            return;
        }
        
		Color textColor = new Color(renderColor.r, renderColor.g,renderColor.b, alpha);

		FontUtils.drawCenter(m_fonts.get(ANNOUNCEMENT_TEXT_FONT), text, (XTILES * TILESIZE) / 2,  TILESIZE * 3, 0, textColor);
		FontUtils.drawCenter(m_fonts.get(ANNOUNCEMENT_SUBTEXT_FONT), subText, (XTILES * TILESIZE) / 2, (int)(TILESIZE * 4.5f), 0, textColor);
	}
	
	public void addAnnouncementJob(String text, String subText, long time) {
		addAnnouncementJob(text, subText, time, Color.black, true);
	}
	
	public void addAnnouncementJob(String text, String subText, long time, Color renderColor) {
		addAnnouncementJob(text, subText, time, renderColor, true);
	}
	
	public void addAnnouncementJob(String text, String subText, long time, Color renderColor, boolean fadeOut) {
		if (m_jobs.isEmpty()) {
			m_jobs.add(new Job(text, subText, time, renderColor, fadeOut));
		}
	}
	
	public void tick() {
		if (m_jobs.isEmpty()) {
			return;
		}
		
		List<Job> trash = new ArrayList<Job>();
		for (Job job : m_jobs) {
			if (job.m_counter > 0) {
				job.m_counter -= Xrpg.MS_PER_TICK;
				
				if (job.m_counter < 0) {
					job.m_counter = 0;
				}
				
				job.m_alpha = (float)job.m_counter / (float)job.m_time;
				//System.out.println(job.m_alpha);
			} else if (job.m_fadeOut == true){
				trash.add(job);
			}
		}
		
		m_jobs.removeAll(trash);
	}
	
	public void renderJobs() {		
		for (Job job : m_jobs) {
			renderAnnouncementText(job.m_text, job.m_subText, job.m_alpha, job.m_color, job.m_fadeOut);
		}
	}
}
