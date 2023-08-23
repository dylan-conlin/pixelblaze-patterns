export var speed = 0.01;
export var hueShift = 0.5;
export var scale = 0.3;
export var zoom = 1.2;
export var autoZoom = 0;
export var zoomSpeed = 0.2;

export var sliderSpeed = function(v) { speed = 0.1 * (1-v); }
export var sliderHueShift = function(v) { hueShift = 1 * v; }
export var sliderScale = function(v) { scale = v; }
export var sliderZoom = function(v) { zoom = v * 1.5; }
export var toggleAutoZoom = function(v) { autoZoom = floor(v + 0.5); }
export var sliderZoomSpeed = function(v) { zoomSpeed = v; }

var t1;

export function beforeRender(delta) {
  t1 = time(speed);
  if(autoZoom) {
    zoom = 0.2 + wave(time(zoomSpeed)) * 1.8; 
  }
    // sets the wrapping intervals for perlin noise, creating a seamless loop
  setPerlinWrap(50, 50, 50); 
}

export function render2D(index, x, y) {
  x /= zoom; // apply the zoom factor to x
  y /= zoom; // apply the zoom factor to y

  // 3D perlin noise to create a complex, organic flow
  var noise = perlinTurbulence(x * scale, y * scale, t1 * scale, 1.5, 0.5, 3); 

  var hue = t1 + hueShift * noise; // shift hue based on noise and time
  var saturation = noise; // vary saturation based on noise
  var value = 1;

  hsv(hue, 1, value);
}

// You can also project up a dimension. Think of this as mixing in the z value
// to x and y in order to compose a stack of matrices.
export function render3D(index, x, y, z) {
  x1 = (x - cos(z / 4 * PI2)) / 2
  y1 = (y - sin(z / 4 * PI2)) / 2
  render2D(index, x1, y1)
}