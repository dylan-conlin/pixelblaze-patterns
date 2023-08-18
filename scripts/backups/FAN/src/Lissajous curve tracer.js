/*

A Lissajous curve tracer

https://en.wikipedia.org/wiki/Lissajous_curve

The A parameter and delta control the X, while
the B parameter controls the Y, allowing for a number of
Lissajous curves. A and B can be between 1 and 8.
Delta can be set in 1/4 pi increments.

The dot size, color, speed, and persistence on scree
can be adjusted.

2021 Ben Hencke

*/

//setting to eraase pixels when changing curve parameters
var clearOnChange = true 

//globals
var x1, y1
var pixels = array(pixelCount)
var hues = array(pixelCount)
var frameHue

//controls variables
var pixelDensity = 8
var t = timer(.1)
var a1 = 3
var b1 = 4
var d1 = PI/2
var fade = .9
var h = 0, s = 1, v = 1
var hueShift = .2
var hueShiftTimer = timer(.1)

//controls
//pick the dot starting color
export function hsvPickerColor(_h, _s, _v) {
  h = _h; v = _v; s = _s;
}

//shift hue by this much
export function sliderHueShift(v) {
  hueShift = v
}

export function sliderHueShiftSpeed(v) {
  v = 1-v
  timerSetInterval(hueShiftTimer, .001 + v*v*v)
}

//from tracers, to solid paints
export function sliderPersistence(v) {
  v = 1-v
  fade = 1-v*v
}

export function sliderSize(v) {
  v = 1-v
  pixelDensity = 1 + v*v*32
}

export function sliderSpeed(v) {
  v = 1-v
  timerSetInterval(t, .001 + v*v*v/5)
}

//Lissajous curve ratio A value
export function sliderA(v) {
  var newValue = 1 + floor(v*7)
  if (a1 != newValue)
    clearPixels()
  a1 = newValue
}
//Lissajous curve ratio B value
export function sliderB(v) {
  var newValue = 1 + floor(v*7)
  if (b1 != newValue)
    clearPixels()
  b1 = newValue
}
//Lissajous curve A delta
export function sliderDelta(v) {
  v = floor(v*7)/8
  var newValue = PI*2 * v
  if (d1 != newValue)
    clearPixels()
  d1 = newValue
}

function clearPixels() {
  if (clearOnChange) {
    pixels.mutate(() => 0)
  }
}

export function beforeRender(delta) {
  var now = timerNow(t)
  //calc current Lissajous dot location
  x1 = sin(now * a1 * PI2 + d1)
  y1 = sin(now * b1 * PI2)
  
  //start with the hue chosen, and shift +- by the hueShuft amount
  frameHue = h - hueShift/2 + triangle(timerNow(hueShiftTimer)) * hueShift
  
  resetTransform()
  translate(-.5, -.5) //center
  //scale up, with a little extra room for larger dots
  scale(2 + 1.7/pixelDensity, 2 + 1.7/pixelDensity) 
}

export function render2D(index, x, y) {
  //this pixel's distance to the dot
  var distance = hypot(x1 - x, y1 - y)
  //calc closeness, scaled by density
  var closeness = clamp(1 - distance * pixelDensity, 0, 1)
  //fade old pixel value, and draw the dot based on closeness
  var pixelValue = pixels[index] = max(pixels[index] * fade, closeness)
  //set the hue if we painted something here
  if (closeness > 0) {
    hues[index] = frameHue
  }
  
  hsv(hues[index],s,pixelValue * v)
}


//timer utility functions for smooth speed adjustment
function timer(interval) {
  return [0, interval]
}

function timerSetInterval(timer, interval) {
  var p1 = time(timer[1]) //measure the current interval's value
  var p2 = time(interval) //measure the new interval's value
  //calculate the phase difference between these
  timer[0] = mod(timer[0] + p1 - p2, 1)
  timer[1] = interval
}

function timerNow(timer) {
  return (time(timer[1]) + timer[0]) % 1
}