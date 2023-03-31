
/*
 Magma Tunnel 2D
 
 More fun things you can do with Perlin noise...
 
 11/1/2022 ZRanger1
*/

translate(-0.5,-0.5);
var timebase = 0;
export var density = 0.7;
export var speed = 1;

// rotate point around origin by by <angle> radians
// place result in globals outx, outy
var outx,outy
function rotate2D(inx,iny,angle) {
   var cosT = cos(angle);
   var sinT = sin(angle);  
  
    var x = inx - 0.5;  var y = iny - 0.5;
    outx = (cosT * x) - (sinT * y) + 0.5;
    outy = (sinT * x) + (cosT * y) + 0.5;
}

export function beforeRender(delta) {
  timebase = (timebase + delta/1000) % 3600;
  
  // per-frame animation timers
  t1 = time(.51);
  noiseTime = timebase * speed;
  noiseYTime = timebase * speed;
}

export function render2D(index, x, y) {
  // make a simple tunnel effect by rotating every pixel a little according to how far it is
  // from the center.
  dist = density/hypot(x,y);
  rotate2D(x,y,dist);

  // use noise field to color and light the transformed pixels
  v = perlin(outx+noiseTime,outy + noiseYTime,timebase,t1)
  
  // squaring the result gives us absolute value, plus a little additional contrast
  v = v * v;    

  // manage color and saturation. I let hue bleed a little bit into the blue-green
  // once in a while just to add a little extra interest. 
  hsv(0.02*v+v*.55,1-v*0.25,v);
}

// You can also project up a dimension. Think of this as mixing in the z value
// to x and y in order to compose a stack of matrices.
export function render3D(index, x, y, z) {
  x1 = (x - cos(z / 4 * PI2)) / 2
  y1 = (y - sin(z / 4 * PI2)) / 2
  render2D(index, x1, y1)
}