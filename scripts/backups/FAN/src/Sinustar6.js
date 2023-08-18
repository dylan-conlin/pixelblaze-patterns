export var speed = .03 // Tune for your physical install's rotation
export function sliderSpeed(v) {
  speed = .3 + (v * 10)
}

// At times, it's snowflake-esque
var t3
function beforeSinustar6(delta) {
  t3 = time(3 / 65.536)
}
function sinustar6(index, r, phi, theta) {
  line = near(r,
    2 * osc(10) + .4 * cos((6 * phi - t3) * PI2)
  , .4)
  hsv(0, 0, line)
}

export function beforeRender(delta) {
  beforeSinustar6(delta)
}

export function render3D(index, r, phi, theta) {
  sinustar6(index, r, phi, theta)
}
  
export function render2D(index, r, phi) {
  render3D(index, r, phi, .5) // Equatorial section
}

export function render(index) {
  render2D(index, index / pixelCount, 0)
}

// Utilities

// Helper to quickly define 0-1 oscillators of a defined period. Becomes
// ineffecient unless only used in beforeRenders.
function osc(sec) { return wave(time(sec / 65.536)) }

// Several modes define a line in space. This sets the defualt thickness of
// those. Use a higher percentage for projects with fewer pixels.
var halfwidthDefault = 0.125

// Returns 1 when a & b are proximate, 0 when they are more than `halfwidth`
// apart, and a gamma-corrected brightness for distances within `halfwidth`
function near(a, b, halfwidth) {
  if (halfwidth == 0) halfwidth = halfwidthDefault
  var v = clamp(1 - abs(a - b) / halfwidth, 0, 1)
  return v * v
}