package xrpg.game.level;

import java.util.Random;

public abstract class PerlinNoise {

    // Generates a smoothed up Perlin noise 2d map.
    public static double[][] generateNoise(Random random, int noiseWidth, int noiseHeight, int frequency, int octaves) {
        float[][] noise = new float[noiseHeight][noiseWidth];
        for (int y = 0; y < noiseHeight; y++) {
            for (int x = 0; x < noiseWidth; x++) {
            	noise[y][x] = random.nextFloat();
            }
        }

        double[][] result = new double[noiseHeight][noiseWidth];
        for (int y = 0; y < noiseHeight; y++) {
            for (int x = 0; x < noiseWidth; x++) {
            	result[y][x] = turbulence(x * frequency, y * frequency, octaves, noise, noiseWidth, noiseHeight);
            }
        }

        return result;
    }

    // Gives the average value for the neighbours of the given location.
    private static double smooth(double x, double y, float[][] noise, int noiseWidth, int noiseHeight) {
    	double fractX = x - Math.floor(x);
    	double fractY = y - Math.floor(y);

    	int x1 = (int) ((Math.floor(x) + noiseWidth) % noiseWidth);
    	int y1 = (int) ((Math.floor(y) + noiseHeight) % noiseHeight);

    	int x2 = (x1 + noiseWidth - 1) % noiseWidth;
    	int y2 = (y1 + noiseHeight - 1) % noiseHeight;

        double value = 0.0;
        value += fractX       * fractY       * noise[y1][x1];
        value += fractX       * (1 - fractY) * noise[y2][x1];
        value += (1 - fractX) * fractY       * noise[y1][x2];
        value += (1 - fractX) * (1 - fractY) * noise[y2][x2];

        return value;
    }

    // Controls the blur of the map.
    private static double turbulence(int x, int y, int size, float[][] noise, int noiseWidth, int noiseHeight) {
        double value = 0.0;
        int initialSize = size;

        while (size >= 1) {
            value += smooth((double)x / size, (double)y / size, noise, noiseWidth, noiseHeight) * size;
            size /= 2.0;
        }

        // System.out.println("[t] value = " + value + " / initialSize = " + initialSize);
        return (128.0 * value / initialSize);
    }
}
