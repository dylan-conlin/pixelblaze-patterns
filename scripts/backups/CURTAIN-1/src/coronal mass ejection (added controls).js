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

export var zoom = 2.0 // define a variable for zoom
export var sliderZoom = function(v) { // define a function to update the zoom variable
  zoom = 0.01 + v * 3.5 // maps v from [0,1] to [0.01,3.51]
}

export var zoomSpeed = 1.0 // define a variable for zoom speed
export var sliderZoomSpeed = function(v) { // define a function to update the zoom speed variable
  zoomSpeed = 0.1 + (1-v) * 3.9 // maps v from [0,1] to [0.1,4]
}

export var autoZoom = 0
export var toggleAutoZoom = function(v) {
  autoZoom = floor(v + 0.5) // toggle auto zoom mode on/off
}

export var rotSpeed = 1.0 // define a variable for rotation speed
export var sliderRotSpeed = function(v) { // define a function to update the rotation speed variable
  rotSpeed = v * 10.0 // maps v from [0,1] to [0,10]
}

var c2 = coreSize / 4;
translate(-0.5,-0.5);
setPerlinWrap(3,256,256);
export var noiseYTime
export var noiseTime

export function beforeRender(delta) {
  if(autoZoom) { // if auto zoom mode is on
    var waveform = wave(time(zoomSpeed)); // sawtooth waveform oscillates between 0.0 and 1.0
    zoom = 0.1 + bezierQuadratic(waveform, 0, 1, 0) * 1; // use the bezierQuadratic function to get a smooth oscillation effect
  }

  t1 = time(rotSpeed * 0.2);
  noiseTime = time(10) * 256;
  noiseYTime = time(speed) * 256;
}

export function render2D(index, x, y) {
  x /= zoom; // apply the zoom factor to x
  y /= zoom; // apply the zoom factor to y

  tmp = hypot(x,y); x = atan2(y,x); y = tmp;  
  
  v = 1-perlinTurbulence(x,y - noiseYTime,noiseTime,1.5,.25,3)
  
  v = max(smoothstep(flareAmount,1,v),(1-((y*v)-c2)/coreSize));  
  v = v * v * v;    

  hsv(t1 - (0.125*v),6.5*y-v, v);
}