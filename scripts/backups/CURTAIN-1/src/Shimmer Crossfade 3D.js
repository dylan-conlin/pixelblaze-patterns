/*
  Demo on 8x8 matrix: https://youtu.be/r0iVGnwqEEE
  
  This pattern shows how to combine several 2D patterns into one with a simple 
  crossfade based on probabilistically picking to render a pixel using the next
  pattern. The effect looks like a shimmering transition. This approach was 
  inspired by the crossfade used in:
  
  https://hackaday.com/2020/04/21/a-jaw-dropping-demo-in-only-256-bytes/
  
  The big benefit is that it doesn't require much rewriting of patterns and 
  doesn't need to compute HSV blending like a real crossfader would.
  
  To combine patterns, first copy them together into one and de-conflict 
  any global variable names, like `v` or `t1`. Then rename each beforeRender() 
  and render2D() into anonymous functions in their respective arrays.
  
  For example, for the first pattern: 
    export function beforeRender(delta) {}
  becomes:
    beforeRenders[0] = function (delta) {}
  and
    export function render2D(index, x, y) {}
  becomes
    renderers[0] = (index, x, y) => {}

*/

secondsPerMode = 5
xFadePct = 0.3 // Percentage of the time we spend in crossfades

modeCount = 3
beforeRenders = array(modeCount)
renderers = array(modeCount)

export function beforeRender(delta) {
  modeTime = time(secondsPerMode * modeCount/ 65.536) * modeCount
  
  // 0 when not crossfading; 0..0.999 when crossfading
  pctIntoXfFade = max(((modeTime % 1) - (1 - xFadePct)) / xFadePct, 0)
  
  for (var m = 0; m < modeCount; m++) {
    beforeRenders[m](delta) // computes ALL beforeRenders
  }
  // ToDo: For many patterns combined, enhance that to just call the 2 needed
}

export function render2D(i, x, y) {
  /* 
    If we're crossfading mode 1 to mode 2, we randomly pick that this pixel will
    come from either mode 1's renderer or mode 2's. Which one it comes from 
    is probabilistically related to the percentage we're into this crossfade.
  */
  skew = random(1) < wave((pctIntoXfFade - 0.5) / 2) // wave makes it "tween"

  thisPixelMode = floor((modeTime + skew) % modeCount)
  renderers[thisPixelMode](i, x, y)
}



// Here's the code copied in from other patterns

// Rotating white line
beforeRenders[0] = (delta) => {
  angle = time(secondsPerMode / 65.536) * PI2
  m = tan(angle) // Slope
  m = clamp(m, -180, 180) // Prevent m * m overflow later
}

renderers[0] = (index, x, y) => {
  distance = abs(-m * x + y + (m - 1) / 2) / sqrt(m * m + 1)
  v = clamp((0.2 - distance)/0.2, 0, 1)
  hsv(0, 0, v * v)
}

// 'Matrix 2D Pulse' - rainbow circles
beforeRenders[1] = (delta) => {
  t1 = time(3.3 / 65.536) * PI2
  t2 = time(6.0 / 65.536) * PI2
  z = 1 + wave(time(13 / 65.536)) * 5
}

renderers[1] = (index, x, y) => {
  v = h = (1 + sin(x * z + t1) + cos(y * z + t2)) * 0.5
  v = v * v * v / 2 
  hsv(h, 1, v)
}

// Rotating checkerboard
beforeRenders[2] = function (delta) {}
renderers[2] = function (index, x, y) {
  phi = PI2 * time(8 / 65.536)   // Rotation angle in radians. Try 8 seconds.
  x0 = 0.5; y0 = 0.5             // Center of rotation
  x = x - x0;  y = y - y0        // Shift the center to the origin
  _x = x * cos(phi) - y * sin(phi) + 3 * x0 // Rotate around origin and re-shift
  _y = y * cos(phi) + x * sin(phi) + 2 * y0
  t20 = time(3 / 65.536)         // Zoom scale and color. Try 3 seconds.
  blocks = 0.5 + 2 * wave(t20)   // Number of blocks visible
  
  h = (_x + _y - t20 - 1)/20
  v = (1 + floor(1 + _x * blocks) + floor(1 + _y * blocks)) % 2 < 1
  hsv(h, 1, v)
}

// You can also project up a dimension. Think of this as mixing in the z value
// to x and y in order to compose a stack of matrices.
export function render3D(index, x, y, z) {
  x1 = (x - cos(z / 4 * PI2)) / 2
  y1 = (y - sin(z / 4 * PI2)) / 2
  render2D(index, x1, y1)
}



