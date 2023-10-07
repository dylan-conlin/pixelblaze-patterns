var black_Blue_Magenta_White_gp = [0,   0,  0,  0, 42,   0,  0, 45, 84,   0,  0,255, 127,  42,  0,255, 170, 255,  0,255, 212, 255, 55,255, 255, 255,255,255]
var inferno = [ 0.0, 0/255, 0/255, 4/255, 0.1, 22/255, 11/255, 57/255, 0.2, 66/255, 10/255, 104/255, 0.3, 106/255, 23/255, 110/255, 0.4, 147/255, 38/255, 103/255, 0.5, 188/255, 55/255, 84/255, 0.6, 221/255, 81/255, 58/255, 0.7, 243/255, 120/255, 25/255, 0.8, 252/255, 165/255, 10/255, 0.9, 246/255, 215/255, 70/255, 1.0, 252/255, 255/255, 164/255, ]
arrayMutate(black_Blue_Magenta_White_gp,(v, i ,a) => v / 255);
// good fire palettes:
var palettes = [
  inferno,
  BlacK_Blue_Magenta_White,
]
//variants of noise can be chosen from
modes = [
  (x,y,z) => (perlin(x, y, z, 0) + 1)/2, //by default perlin returns negative values too, scale this to 0-1
  (x,y,z) => perlinRidge(x, y, z, 2, .5, 1.1, 3),
  (x,y,z) => (perlinFbm(x, y, z, 2, .5, 3)+1)/2, //this can also generate negative values
  (x,y,z) => perlinTurbulence(x, y, z, 2, .5, 3),
]

export var mode = 1
export var fireScale = 3
export var risingSpeed = 1
export var morphSpeed = 1
export var currentPalette = 0

setPalette(palettes[currentPalette]);

export function sliderPalette(v) {
  currentPalette = round(v*(palettes.length - 1))
  setPalette(palettes[currentPalette]);
}

export function showNumberPaletteMode() {
  return currentPalette + 1;
}

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

export function toggleDisableSliders(v) {
  if (v) {
    fireScale =	11.000000
    mode = 0.000000
    morphSpeed = 1.235062
    risingSpeed = 5.199982
  }
}
var timeCounter = 0; // Initialize a counter to keep track of time

export function beforeRender(delta) {
  timeCounter += delta; // Increment the time counter by the time since the last frame
  morphTime = time(6 * morphSpeed) * 256
  yTime = time(1.3 * risingSpeed) * 256
  modeFn = modes[mode]
  resetTransform()
  translate(-.5, 0)
  scale(fireScale,fireScale)
}

export function render2D(index, x, y) {
  v = modeFn(x, y + yTime, morphTime )
  v = v * 2*(1 - abs(x/fireScale*1.8))
  v = v * y/fireScale
  v = Math.min(v,1)
  paint(v, v)
}

export function render3D(index, x, y, z) {
  x1 = (x - cos(z / 4 * PI2)) / 2
  y1 = (y - sin(z / 4 * PI2)) / 2
  render2D(index, x1, y1)
}
