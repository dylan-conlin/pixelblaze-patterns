// We're using the Perlin FBM function to generate a star field that we can fly through.
// Lacunarity, gain, and octaves control the character of the Perlin FBM function.

export var lacunarity = 2 // The lacunarity controls the frequency of the octaves.
export var gain = 0.5 // The gain controls the amplitude of the octaves.
export var octaves = 4 // The number of noise functions summed together.

// Zoom value, allows to control the density of the star field.
export var zoom = 1.0 

// Slider for zoom value, range from 1 to 20.
// The slider is reversed, i.e., moving the slider to the right (towards 1), decreases zoom,
// creating an effect of being further from the stars.
export function sliderZoom(v) {
  zoom = 1 + (1 - v) * 19 // Subtract v from 1 to reverse the slider.
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
  t += delta / 2000 // Adjust speed of travel.
}

// For each pixel, we calculate its brightness and color based on Perlin noise.
export function render3D(index, x, y, z) {
  // Generate Fractal Brownian Motion with coordinates scaled by zoom factor.
  var n = perlinFbm(x*zoom, y*zoom, t, lacunarity, gain, octaves) 

  // The output of the Perlin function is between -1 and 1, so we shift and
  // scale it to be a brightness value between 0 and 1.
  n = (n + 1) / 2 

  // Determine hue based on brightness (Perlin noise value).
  var hue = n 

  // Set the current pixel to the calculated hue, saturation, and brightness.
  hsv(hue, 1, n)
}
