var rgbGradient = [
  0,    0, 0, 0,  // Black
  0.2,  1, 0.5, 0, // Orange
  0.8,  1, 1, 1,  // White
  1,    0.5, 0.5, 0.5 // Gray
]
setPalette(rgbGradient)


// Variants of Perlin noise for spark effect
modes = [
  (x, y, z) => random(1) < 0.1 * perlin(x, y, z, morphSpeed) ? random(1) : 0, // Perlin-controlled random sparks
  (x, y, z) => perlin(x, y, z, morphSpeed) > 0.8 ? random(1) : 0, // Perlin threshold sparks
  (x, y, z) => random(1) < 0.05 ? perlin(x, y, z, morphSpeed) : 0, // Sparse Perlin sparks
  (x, y, z) => (perlin(x * 10, y * 10, z, morphSpeed) + 1) / 2 * random(1) < 0.1 ? 1 : 0 // High frequency Perlin sparks
]


export var mode = 0, sparkScale = 1, risingSpeed = 1, morphSpeed = 1
export function sliderMode(v) {
  mode = round(v * (modes.length - 1))
}
export function showNumberMode() {
  return mode + 1
}
export function sliderScale(v) {
  sparkScale = 1 + v * 10
}
export function sliderRisingSpeed(v) {
  v = 1 - v
  risingSpeed = 0.2 + (v * v) * 5
}
export function sliderMorphSpeed(v) {
  v = 1 - v
  morphSpeed = 0.2 + (v * v) * 5
}

export function beforeRender(delta) {
  morphTime = time(6 * morphSpeed) * 256
  yTime = time(1.3 * risingSpeed) * 256
  modeFn = modes[mode]
  resetTransform()
  translate(-.5, 0)
  scale(sparkScale, sparkScale)
}

export function render3D(index, x, y, z) {
  x1 = (x - cos(z / 4 * PI2)) / 2
  y1 = (y - sin(z / 4 * PI2)) / 2
  render2D(index, x1, y1)
}

export function render2D(index, x, y) {
  v = modeFn(x, y + yTime, morphTime)
  v = v * 2 * (1 - abs(x / sparkScale * 1.8))
  v = v * y / sparkScale
  v = min(v, 1)
  paint(v, v)
}
