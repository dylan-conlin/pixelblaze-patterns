var timebase = 0;
var t1, cos_t1, sin_t1;

export var contrast = 1/24;
export var whiteLevel = 1.125;
export var speed = 3.5;

// Pre-compute repetitive values in sliders
export function sliderSpeed(v) {
  speed = 1 + 8*v;
}

export function sliderWhiteLevel(v) {
  whiteLevel = 0.8 + (1-v)
}

export function sliderContrast(v) {
  contrast = 1/(16+24*v);
}

function updateTimedependentVariables() {
  t1 = timebase / 6;
  // Precompute values for cos(t1) and sin(t1) to use in render2D
  cos_t1 = cos(t1);
  sin_t1 = sin(t1);
}

export function beforeRender(delta) {
  timebase = (timebase + delta/1000) % 1000;
  updateTimedependentVariables();
}

export function render2D(index, x, y) {
  var px, py, ix, iy, c;

  // scale coords to work well as angles for sin/cos
  px = x * PI2 - 20;  
  py = y * PI2 - 20;
  ix = px; 
  iy = py;
  c = 1;

  // Adjust speed
  var speedAdj1 = 1 - speed;
  var speedAdj2 = 1 - speed / 2;
  var t1 = timebase * speedAdj1;  // Assuming timebase is defined globally as in your working example
  var t2 = timebase * speedAdj2;

  // build a couple of lumpy circular "waves" using adjusted speed
  tmp = px + cos(t1 - ix) + sin(t1 + iy); 
  iy = py + sin(t1 - iy) + cos(t1 + ix);
  ix = tmp;

  c += 1/hypot(px/sin(t1 + ix)*contrast, py/cos(t1 + iy)*contrast);

  tmp = px + cos(t2 - ix) + sin(t2 + iy); 
  iy = py + sin(t2 - iy) + cos(t2 + ix);
  ix = tmp;

  c += 1/hypot(px/sin(t2 + ix)*contrast, py/cos(t2 + iy)*contrast);
  
  // Gamma correction
  c = 1.65 - sqrt(c/2);
  c = c * c * c * c;
  c = clamp(c, 0, 1);
  
  hsv(0.6667 - (0.3 * c), whiteLevel - c, c);
}


export function render3D(index, x, y, z) {
  var x1 = (x - cos(z / 4 * PI2)) / 2;
  var y1 = (y - sin(z / 4 * PI2)) / 2;
  render2D(index, x1, y1);
}
