var radius = 0.5; export function sliderBallRadius(v) { radius = v; } 
var speed = 0.5; export function sliderBallSpeed(v) { speed = v; } 

br = [ 1, 0, 0 ]; bg = [ 0, 1, 0 ]; bb = [ 0, 0, 1 ];

export var bx = array(3); bx.forEach((v, i, a) => { a[i] = (i / 3) + random(1) / 3; });
export var by = array(3); by.forEach((v, i, a) => { a[i] = (i / 3) + random(1) / 3; });
export var vx = array(3); vx.forEach((v, i, a) => { a[i] = (1/4) + (1 - random(2)) / 6; });
export var vy = array(3); vy.forEach((v, i, a) => { a[i] = /*(1/4)*/vx[i] + (1 - random(2)) / 6; });

export function beforeRender(delta) { 
  bx.forEach((v, i, a) => { a[i] += speed * vx[i]; if ((a[i] >= 1) || (a[i] <= 0)) { a[i] = clamp(a[i], 0, 1); vx[i] *= -1; } });
  by.forEach((v, i, a) => { a[i] += speed * vy[i]; if ((a[i] >= 1) || (a[i] <= 0)) { a[i] = clamp(a[i], 0, 1); vy[i] *= -1; } });
}

export function render2D(index,x,y) { 
  r = 0; g = 0; b = 0;
  for (var ball = 0; ball < 3; ball++) {
    var distance = hypot(x-bx[ball], y-by[ball]);
    if (distance < radius) {
      shade = pow(1 - distance/radius, 2);
      r += shade * br[ball];
      g += shade * bg[ball];
      b += shade * bb[ball];
    }
  }
   
  rgb(r, g, b);
} 
