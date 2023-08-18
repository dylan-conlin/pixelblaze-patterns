export var scale = .5
export var patternSpeed; // declare the pattern speed variable

export function sliderPatternSpeed(v) {
  patternSpeed = 0.1 + (1-v) * 0.08; // set pattern speed range from 0.01 to 0.11
}

export var t1, t2;

export function beforeRender(delta) {
  t1 = time(patternSpeed)
  t2 = time(patternSpeed * 5)
}

export function render3D(index, x, y, z) {
  x -= 0.5
  y -= 0.5
  z -= 0.5
  
  r = sqrt(x*x + y*y + z*z) * scale
  h = (x+y+z)/3 + t2
  v = triangle(r - t1) - .75
  
  var spark = triangle(r - t1 + .2) - .75 > random(2)
  if (spark) {
    rgb(1,1,1) 
  } else {
    v = v*4
    v = v*v*v
    hsv(h,1,v)
  }
}
