package xrpg.game;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.lwjgl.input.Keyboard;

public class InputHandler {

	public enum Action {
		MOVE_UP,
		MOVE_LEFT,
		MOVE_DOWN,
		MOVE_RIGHT,
		ATTACK,
		MENU,
		RUN;
	}
	
	public class Key {
		long m_presses = 0;
		long m_absorbs = 0;
		boolean m_clicked = false;
		
		public boolean m_down = false;
	
		Key() {
			m_keys.add(this);
		}
	
		void toggle(boolean pressed) {
			if (pressed != m_down) {
				//System.out.println("Key pressed !");
				m_down = pressed;
			}
			if (pressed) {
				m_presses++;
			}
		}
	
		void tick() {
			if (m_absorbs < m_presses) {
				m_absorbs++;
				m_clicked = true;
			} else {
				m_clicked = false;
			}
		}
	}

	private List<Key> m_keys = new ArrayList<Key>();

	public Key m_up = new Key();
	public Key m_down = new Key();
	public Key m_left = new Key();
	public Key m_right = new Key();
	public Key m_attack = new Key();
	public Key m_menu = new Key();
	public Key m_run = new Key();

	private Map<Integer, Key> m_bindings = new HashMap<Integer, Key>();

	public InputHandler() {
		bind(Keyboard.KEY_Z, m_up);
		bind(Keyboard.KEY_Q, m_left);
		bind(Keyboard.KEY_S, m_down);
		bind(Keyboard.KEY_D, m_right);
		bind(Keyboard.KEY_LCONTROL, m_attack);
		bind(Keyboard.KEY_RETURN, m_menu);
		bind(Keyboard.KEY_LSHIFT, m_run);
	}
	
	public void pollInput() {
		while (Keyboard.next()) {
			if (m_bindings.containsKey(Keyboard.getEventKey())) {
				m_bindings.get(Keyboard.getEventKey()).toggle(Keyboard.getEventKeyState());
			}
		}
	}

	public void bind(int keyCode, Key key) {
		m_bindings.put(keyCode, key);
	}

	public void tick() {
		for (Key key : m_keys) {
			key.tick();
		}
	}

	public void releaseAll() {
		for (Key key : m_keys) {
			key.m_down = false;
		}
	}
}
