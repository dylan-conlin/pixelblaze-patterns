// Coronal Mass Ejection 2D
// A demonstration of Pixelblaze's Perlin noise and smoothstep functions
//
// 10/09/2022 ZRanger1


export var speed = 8
export var sliderSpeed = function(v) {
  speed = 35 - (v * 32)
}

export var coreSize = 0.1
export var sliderCoreSize = function(v) {
  coreSize = 0.1 + v
}

export var flareAmount = 0.675
export var sliderFlareAmount = function(v) {
  flareAmount = 1 - v
}

var c2 = coreSize / 4;
translate(-0.5,-0.5);
setPerlinWrap(3,256,256);
export var noiseYTime
export var noiseTime

export function beforeRender(delta) {
  
  // per-frame animation timers
  t1 = time(0.2);
  noiseTime = time(10) * 256;
  noiseYTime = time(speed) * 256;
}

// You can also project up a dimension. Think of this as mixing in the z value
// to x and y in order to compose a stack of matrices.
export function render3D(index, x, y, z) {
  x1 = (x - cos(z / 4 * PI2)) / 2
  y1 = (y - sin(z / 4 * PI2)) / 2
  render2D(index, x1, y1)
}

export function render2D(index, x, y) {
  // convert to radial coords
  tmp = hypot(x,y); x = atan2(y,x); y = tmp;  
  
  // generate noise field 
  v = 1-perlinTurbulence(x,y - noiseYTime,noiseTime,1.5,.25,3)
  
  // convert noise field to discrete radial "flares"
  v = max(smoothstep(flareAmount,1,v),(1-((y*v)-c2)/coreSize));  
  v = v * v * v;    

  // draw star + stellar flares, always white hot at center
  // occasionally throwing off super hot flare bits
  hsv(t1 - (0.125*v),6.5*y-v, v);
}
