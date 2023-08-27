// Bezier Testbed -- Animated "Leaping" curve
// requires Pixelblaze 3 w/3.30 or higher firmware
//
// 11/2022 ZRanger1
export function beforeRender(delta) {
  t1 = time(0.04);
  c1 = wave(t1);
  
  c4 = wave(-0.25-t1);

  t2 = time(0.01)
  c2 = wave(t2)
  c3 = wave(-0.25-t2)
}

export function render2D(index,x,y) {
  d = bezierCubic(x,c1,c2,c3,c4);
  v = 1-min(1,(abs(y-d)/ 0.165));
  hsv(t1+d, 1, v*v*v)
}

// You can also project up a dimension. Think of this as mixing in the z value
// to x and y in order to compose a stack of matrices.
export function render3D(index, x, y, z) {
  x1 = (x - cos(z / 4 * PI2)) / 2
  y1 = (y - sin(z / 4 * PI2)) / 2
  render2D(index, x1, y1)
}
