export function beforeRender(delta) {
  t1 = time(.1)
  r1 = sin(time(.1)*PI2)
  r2 = sin(time(.05)*PI2)
  r3 = sin(time(.07)*PI2)
}

export function render(index) {
  v = triangle((2*wave(t1) + index/pixelCount) %1)
  v = v*v*v*v*v
  s = v < .9
  hsv(t1,s,v)
}

export function render2D(index, x, y) {
  render3D(index, x, y, 0)
}

export function render3D(index, x, y, z) {
  v = triangle((3*wave(t1) + x*r1 + y*r2 + z*r3) %1)
  v = v*v*v*v*v
  s = v < .8
  hsv(t1,s,v)
}