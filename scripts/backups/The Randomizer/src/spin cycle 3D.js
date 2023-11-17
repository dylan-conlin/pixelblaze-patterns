export var speed = 10
// Define a slider to control the speed of the animation
export function sliderSpeed(v) {
  speed = 10 - v * 9.9; // Map slider values from 
  // speed = v * 9.9 + 0.1 // Map slider values from [0, 1] to [0.1, 10]
  return speed
}


export function beforeRender(delta) {
  t1 = time(speed)
  t2 = time(.1)
}

// Main render function that calls render3D() with 3D coordinates
export function render(index) {
 // Calculate X-coordinate as index/pixelCount (Y and Z always 0 in 1D)
  render3D(index, index/pixelCount, 0, 0)
}

// 2D render function that adds a z-value of 0 and calls render3D()
export function render2D(index, x, y) {
  // render3D(index, x, y, 0) // Add a Z-coordinate of 0 to the 2D coordinates and call render3D

  h = index/pixelCount *(5+wave(t1)*5) + wave(t2)*2
  h = (h %.5) + t1
  v = triangle((index/pixelCount*5 + t1*10) %1)
  v = v*v*v
  hsv(h,1,v)
}

// You can also project up a dimension. Think of this as mixing in the z value
// to x and y in order to compose a stack of matrices.
export function render3D(index, x, y, z) {
  x1 = (x - cos(z / 4 * PI2)) / 2
  y1 = (y - sin(z / 4 * PI2)) / 2
  render2D(index, x1, y1)
}