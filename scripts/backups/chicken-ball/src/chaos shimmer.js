// Swirly plasma that occasionally explodes into weirdness.
// Requires Pixelblaze 3 with v3.17 or newer firmware.
// 7/15/21 - ZRanger1

var chaosLevel = 0.2;  // more is more
var theta;             // current rotation angle

export function beforeRender(delta) {
  t1 = wave(time(.5)) * 40;  // scale time for sin and cos
  
  mx = 0.5+(cos(t1) * 0.3);
  my = 0.5+(sin(t1) * 0.5); 

  theta = PI2 * time(0.25);
  resetTransform();
  rotate(theta);
}

// You can also project up a dimension. Think of this as mixing in the z value
// to x and y in order to compose a stack of matrices.
export function render3D(index, x, y, z) {
  x1 = (x - cos(z / 4 * PI2)) / 2
  y1 = (y - sin(z / 4 * PI2)) / 2
  render2D(index, x1, y1)
}

// vectors for calculation
var mx,my;
var pr,pg,pb;
var dotp;
export function render2D(index,x,y) {
  pr = x; pg = y; pb = mx;
  
  // perturb coords w/our time-based function a few times
 //  and use the result as RGB color.   This is a common
 // GLSL shader trick.  The upside is that additive color
 // mixing is trivial, the downside is that precise control
 // of output color is much more work.  Here, I don't even try.
 // It's... pink.  And blue!
  for (var i = 0; i < 5; i++) {
    dotp = (pr * pr + pg * pg + pb * pb);
    pr = abs(pr)/dotp - 1;
    pb = abs(pg)/dotp - 1;
    pg = abs(pb)/dotp - my * chaosLevel;
  }
  
  // gamma correct and display
  rgb(pr*pr,pg*pg,pb*pb);
}