// It started out trying to plot Bessel functions.
// It ended somewhere else; 
// I like trying to get chaotic behavior out of patterns without using random()
// Jeff Vyduna / 2021 / MIT License

export var tSpeed = .84
export function sliderTransitionSpeed(_v) { tSpeed = _v }
export var rotSpeed = 0.50 // define a variable for rotation speed
export var s1, P, pan, colorDepth, t1
export var bounceRate = 0.1
export function sliderRateBounce(_v) { bounceRate = _v }
export function beforeRender(delta) {
  P = 2 * wave(time(.1) / 2 - .25) * PI2 
  t2 = time(.9)
  var x = wave(time(bounceRate))
  colorDepth = 2 + 4 * wave(time(.3))
  pan = easeInOut(x, tSpeed)
  t1 = time(rotSpeed * 0.2);
}

// https://www.desmos.com/calculator/ychs1aod5e
var eioexp = (x, p) => (pow((2 * x - 1), 1/p) + 1) / 2

function easeInOut(x, s) {
  var p = 1 + 40 * s * s * s
  if (x < .5) { // Had to do it two sided, as pow(-27, 1/3) doesn't return -3
    x = 1 - x
    return 1 - eioexp(x, p)
  } else {
    return eioexp(x, p)
  }
}

export function render2D(index, x, y) {
  
  
  var pct = 3 * (index / pixelCount - .5 - pan)
  var pctSqueeze = 10 * pct * pct * pct
  w1 = sin(pctSqueeze * pct + 2 * P)
  w2 = sin(pctSqueeze -  P)
  v = (w1 + w2) / 2
  var h = t1 - (0.125*v)
  hsv(h, 1, v * v * v)

}

export function render3D(index, x, y, z) {
  x1 = (x - cos(z / 4 * PI2)) / 2
  y1 = (y - sin(z / 4 * PI2)) / 2
  render2D(index, x1, y1)
}
