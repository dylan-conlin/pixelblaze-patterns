/*
  Spinwheel 2D
  Colorful, flowerlike radial spinner.
  Yet another example of the complex and unpredictible things
  that happen when you combine a few simple functions...

   7/09/21 JEM(zranger1)
*/

var t1,t2;
var speed = 6;

export function beforeRender(delta) {
  t1 = time(5) * (-PI * wave(time(0.2)));
  t2 = wave(time(.5)) * speed;
}

export function render2D(index,x,y) {
  x = x- 0.5; y = y - 0.5;
  var arX = (atan2(x,y)+t1*30);
  var arY = (hypot(x,y)+t2);
  
  var phi = floor(arY) / PI2;
  phi += (phi == 0) * 0.618;
  
  arX = frac(arX);
  arY = frac(arY);
  
  var h = (.1/(arX*arX+arY*arY) * .1) * phi; 
  hsv(t1+(x*y)+h, 1-h, h);
}

// You can also project up a dimension. Think of this as mixing in the z value
// to x and y in order to compose a stack of matrices.
export function render3D(index, x, y, z) {
  x1 = (x - cos(z / 4 * PI2)) / 2
  y1 = (y - sin(z / 4 * PI2)) / 2
  render2D(index, x1, y1)
}