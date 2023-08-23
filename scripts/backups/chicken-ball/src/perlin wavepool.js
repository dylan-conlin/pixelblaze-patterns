// We're using Perlin noise to simulate a wave pool.
// Lacunarity, gain, and octaves control the character of the Perlin noise function.

export var lacunarity = 2 // The lacunarity controls the frequency of the octaves.
export var gain = 0.5 // The gain controls the amplitude of the octaves.
export var octaves = 4 // The number of noise functions summed together.

var fire = [
  0,    0, 0, 0,
  0.2,  1, 0, 0,
  0.8,  1, 1, 0,
  1,    1, 1, 1
]
var inferno = [ 0.0, 0/255, 0/255, 4/255, 0.1, 22/255, 11/255, 57/255, 0.2, 66/255, 10/255, 104/255, 0.3, 106/255, 23/255, 110/255, 0.4, 147/255, 38/255, 103/255, 0.5, 188/255, 55/255, 84/255, 0.6, 221/255, 81/255, 58/255, 0.7, 243/255, 120/255, 25/255, 0.8, 252/255, 165/255, 10/255, 0.9, 246/255, 215/255, 70/255, 1.0, 252/255, 255/255, 164/255, ]

var palettes = [fire, inferno /*, ... other palettes */];
var currentPalette = random(palettes.length);
setPalette(palettes[currentPalette]);

export function showNumberPaletteMode() {
  return currentPalette + 1;
}


// Zoom value, allows to control the density of the wave pool.
export var zoom = 1.0 

// Slider for zoom value, range from 1 to 20.
export function sliderZoom(v) {
  zoom = 1 + (1 - v) * 19
}

// Slider to control lacunarity, between 1.0 and 3.0
export function sliderLacunarity(v) {
  lacunarity = 1 + v * 2
}

// Slider to control gain, between 0.0 and 1.0
export function sliderGain(v) {
  gain = v
}

// Slider to control octaves, between 1 and 8
export function sliderOctaves(v) {
  octaves = 1 + floor(v * 7)
}

// Time variable to create animation.
var t = 0 

// Before rendering, we update our time variable.
export function beforeRender(delta) {
  t += delta / 2000
 // Update the palette
  setPalette(palettes[currentPalette]);


}

// For each pixel, we calculate its brightness and color based on Perlin noise.
export function render3D(index, x, y, z) {
  // Generate Perlin noise with coordinates scaled by zoom factor.
  var n = perlinFbm(x*zoom, y*zoom, t, lacunarity, gain, octaves)

  // The output of the Perlin function is between -1 and 1, so we shift and
  // scale it to be a brightness value between 0 and 1.
  n = (n + 1) / 2 

  // Determine hue based on brightness (Perlin noise value).
  var hue = n * 0.6 // Adjusted to give a water-like color

  // Set the current pixel to the calculated hue, saturation, and brightness.
  //hsv(hue, 1, n)
   paint(hue, n);  // Replace 'v' with the appropriate value based on your wave pool logic
   
   
}
