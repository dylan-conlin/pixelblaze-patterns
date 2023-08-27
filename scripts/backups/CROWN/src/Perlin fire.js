/* 
Demonstration of Perlin noise functions to generate fire 
The first mode shows Perlin noise scaled to 0-1.
The second shows a fractal ridge function, creating fire tendrils.
The third fractal Brownian Motion (fBm), a fairly decent aproximation of fire.
The fourth uses a fractal turbulence function, and looks like a blackened rolling fireball.

2022 Ben Hencke (wizard)
*/

var rgbGradient = [
  0,    0, 0, 0,
  0.2,  1, 0, 0,
  0.8,  1, 1, 0,
  1,    1, 1, 1
]
setPalette(rgbGradient)

//variants of noise can be chosen from
modes = [
  (x,y,z) => (perlin(x, y, z, 0) + 1)/2, //by default perlin returns negative values too, scale this to 0-1
  (x,y,z) => perlinRidge(x, y, z, 2, .5, 1.1, 3),
  (x,y,z) => (perlinFbm(x, y, z, 2, .5, 3)+1)/2, //this can also generate negative values
  (x,y,z) => perlinTurbulence(x, y, z, 2, .5, 3),
]
export var mode = 1, fireScale = 3, risingSpeed = 1, morphSpeed = 1
export function sliderMode(v) {
  mode = round(v*(modes.length - 1))
}
export function showNumberMode() {
  return mode + 1
}
export function sliderScale(v) {
  fireScale = 1 + v*10 
}
export function sliderRisingSpeed(v) {
  v = 1-v
  risingSpeed = 0.2 + (v*v) * 5
}
export function sliderMorphSpeed(v) {
  v = 1-v
  morphSpeed = 0.2 + (v*v) * 5
}

export function beforeRender(delta) {
  //by default perlin wraps smoothly every 256, so 0.0 and 256 are the same
  //animate the perlin noise by moving z across time from 0-256
  //this also means increasing the interval we use with time() to slow it down
  //and happens to give us a lot of unique noise
  morphTime = time(6 * morphSpeed) * 256
  yTime = time(1.3 * risingSpeed) * 256
  modeFn = modes[mode]
  resetTransform()
  translate(-.5, 0)
  scale(fireScale,fireScale)
}

export function render2D(index, x, y) {
  //call out to a noise function based on the mode, animating y to rise and using z to morph the fire over time
  v = modeFn(x, y + yTime, morphTime ) 
  
  //create a hotter column around the center of x, fading towards the edges
  v = v * 2*(1 - abs(x/fireScale*1.8)) 
  
  //fade out the higher it gets
  v = v * y/fireScale 
  
  //keep palette from wrapping if noise goes past 1.0
  v = min(v,1) 
  paint(v, v)
}