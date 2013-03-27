package xrpg.game.level;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Random;

import xrpg.game.level.tile.Tile;

public abstract class LevelGen {
	private static final int FREQUENCY = 1;
	private static final int OCTAVES = 16;

	// Simple smoothing method, gets rid of unwanted blurps.
	private static void smooth(int w, int h, double[][] map) {
		for (int y = 0; y < h; y++) {
			for (int x = 0; x < w; x++) {
				double average = 0;
				int times = 0;

				if (x - 1 >= 0) {
					average += map[y][x - 1];
					times++;
				}
				if (x + 1 < w - 1) {
					average += map[y][x + 1];
					times++;
				}
				if (y - 1 >= 0) {
					average += map[y - 1][x];
					times++;
				}
				if (y + 1 < h - 1) {
					average += map[y + 1][x];
					times++;
				}

				if (x - 1 >= 0 && y - 1 >= 0) {
					average += map[y - 1][x - 1];
					times++;
				}
				if (x + 1 < w - 1 && y - 1 >= 0) {
					average += map[y - 1][x + 1];
					times++;
				}
				if (x - 1 >= 0 && y + 1 < h - 1) {
					average += map[y + 1][x - 1];
					times++;
				}
				if (x + 1 < w  - 1&& y + 1 < h - 1) {
					average += map[y + 1][x + 1];
					times++;
				}

				average += map[y][x];
				times++;

				average /= times;

				map[y][x] = average;
			}
		}
	}

	private static char[][] createIsland(Random random, int w, int h) {
		double[][] map = PerlinNoise.generateNoise(random, w, h, FREQUENCY, OCTAVES);

		int[][] particleMap = new int[h][w];

		for (int i = 0; i < (int)(w * h * 0.85); i++) {
			int x = 15 + random.nextInt(w - 33);
			int y = 15 + random.nextInt(h - 33);

			// System.out.println("i="+i+" x="+x+" y="+y);
			for (int j = 0; j < Math.floor(w * h * 0.05); j++) {
				particleMap[y][x] += 7;

				if (particleMap[y][x] >= 255) {
					particleMap[y][x] = 255;
				}

				int currentValue  = particleMap[y][x];
				
				List<Integer> choices = new ArrayList<Integer>();
				if (x - 1 > 0) {
					if (particleMap[y][x - 1] <= currentValue) {
						choices.add(0);
					}
				}
				if (x + 1 < w - 1) {
					if (particleMap[y][x + 1] <= currentValue) {
						choices.add(1);
					}
				}
				if (y - 1 > 0) {
					if (particleMap[y - 1][x] <= currentValue) {
						choices.add(2);
					}
				}
				if (y + 1 < w - 1) {
					if (particleMap[y + 1][x] <= currentValue) {
						choices.add(3);
					}
				}

				if (choices.isEmpty()) {
					break;
				}

				int actualChoice = choices.get(random.nextInt(choices.size()));
				if (actualChoice == 0) {
					x -= 1;
				} else if (actualChoice == 1) {
					x += 1;
				} else if (actualChoice == 2) {
					y -= 1;
				} else if (actualChoice == 3) {
					y += 1;
				}
			}
		}

		for (int y = 0; y < h; y++) {
			for (int x = 0; x < w; x++) {
				map[y][x] *= (double)particleMap[y][x] / 255;
				//System.out.println("y="+y+" x="+x+" map[y][x]="+map[y][x]);
			}
		}

		smooth(w, h, map);

		double waterline = getWaterLine(w, h, map);
		long rockCount = 0;
		long grassCount = 0;
		long sandCount = 0;
		long waterCount = 0;
		long treeCount = 0;

		System.out.println("Waterline is @ " + waterline);
		// Generate ground.
		char[][] tileMap = new char[h][w];
		for (int y = 0; y < h; y++) {
			for (int x = 0; x < w; x++) {
				double tile = Math.floor(map[y][x]);

				char mapTile;

				if (tile <= waterline) {
					mapTile = Tile.ms_water.m_tileId;
					waterCount++;
				} else if (tile > waterline && tile <= waterline + 15) {
					mapTile = Tile.ms_sand.m_tileId;
					sandCount++;
				} else if (tile > waterline + 15 && tile <= waterline + 60) {
					mapTile = Tile.ms_grass.m_tileId;
					grassCount++;
				} else {
					mapTile = Tile.ms_rock.m_tileId;
					rockCount++;
				}

				// Add trees.
				if (mapTile == Tile.ms_grass.m_tileId) {
					if (random.nextInt(10) == 0) {
						mapTile = Tile.ms_tree.m_tileId;
						grassCount--;
						treeCount++;
					}
				}

				// Add cacti.
				if (mapTile == Tile.ms_sand.m_tileId) {
					if (random.nextInt(30) == 0) {
						mapTile = Tile.ms_cactus.m_tileId;
						grassCount--;
						treeCount++;
					}
				}

				tileMap[y][x] = mapTile;
			}
		}

		System.out.println("map total :\n\t"+rockCount+" rock / "+grassCount+" grass / "+sandCount+" sand / "+waterCount+" water / "+treeCount+" tree");

		return tileMap;
	}

	public static List<Town> getTowns(Random random, int w, int h, char[][] map) {
		List<Town> towns = new ArrayList<Town>();

		int xt = (int) Math.floor((w / 10) + (random.nextFloat() * w * 0.8));
		int yt = (int) Math.floor((w / 10) + (random.nextFloat() * h * 0.8));

		while (map[yt][xt] == Tile.ms_water.m_tileId || map[yt][xt] == Tile.ms_rock.m_tileId) {
			int dir = random.nextInt(4);
			if (dir == 0) xt++;
			if (dir == 1) xt--;
			if (dir == 2) yt++;
			if (dir == 3) yt--;
		}

		towns.add(new Town(0, xt, yt, random));

		return towns;
	}

	public static double getWaterLine(int w, int h, double[][] map) {
		double[] values = new double[w * h];

		for (int y = 0; y < h; y++) {
			for (int x = 0; x < w; x++) {
				values[y * h + x] = map[y][x];
			}
		}
		
		Arrays.sort(values);
		
		System.out.println(values.length + " values / waterline @ " + ((values.length - 1) * 0.40) + " / rounded @ " + Math.floor((values.length - 1) * 0.40));
		return values[(int) Math.floor((values.length - 1) * 0.40)];
	}

	public static char[][] createSurfaceMap(Random random, int w, int h) {
		return createIsland(random, w, h);
	}
}
