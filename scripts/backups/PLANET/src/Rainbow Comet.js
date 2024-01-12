/*
   Multi-octave additive plasma. Bright circular waves
   in primary colors.
   
   MIT License
   Take this code and use it to make cool things!

   3/21/2022  ZRanger1
*/
export var sc = 0.2862;
export var speed = 0.11;
var theta = 0;
var t1,t2;

export function sliderSpeed(v) {
  speed = mix(0.8,0.02,v);
}

export function sliderScale(v) {
  sc = clamp(v * v,0.04,1);
}

export function beforeRender(delta) {
  t1 = time(speed);
  t2 = wave(t1);

  theta += (-1+2*t2) * PI2 * delta/2000;
  theta = theta % PI2;
  
  resetTransform();
  translate(-0.5,-0.5);
  rotate(theta)
  scale(sc,sc)
}

// linear interpolator
function mix(start,end,val) {
  return start * (1-val) + end * val;
}

export function render2D(index,x,y) {

  // distort incoming coordinates by adding offsets at 3 different scales
  x += triangle(t1+hypot(x,y)) - 0.5;
  y += triangle(t1+hypot(x,y)) - 0.5;
  
  x += 0.5 * (triangle(t1+hypot(x,y)) - 0.5);
  y += 0.5 * (triangle(t1+hypot(x,y)) - 0.5);
  
  x += 0.25 * (triangle(t1+hypot(x,y)) - 0.5);
  y += 0.25 * (triangle(t1+hypot(x,y)) - 0.5);  
  
  
  // convert to RGB color.
  r = wave(t2+x);
  g = wave(t2+y);
  b = wave(t2+x+y);

  rgb(r*r,g*g,b*b)
}
// You can also project up a dimension. Think of this as mixing in the z value
// to x and y in order to compose a stack of matrices.
export function render3D(index, x, y, z) {
  x1 = (x - cos(z / 4 * PI2)) / 2
  y1 = (y - sin(z / 4 * PI2)) / 2
  render2D(index, x1, y1)
}