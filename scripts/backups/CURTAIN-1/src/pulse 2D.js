export var zoom = 5.8;  // Added zoom variable

export function beforeRender(delta) {
  t1 = time(3.3 / 65.536) * PI2;  // Sawtooth 0 to 2*PI every 3.3 seconds
  t2 = time(6.0 / 65.536) * PI2;  // Sawtooth 0 to 2*PI every 6 seconds
  z = 1 + wave(time(13 / 65.536)) * 5;  // Sine wave, min = 1, max = 6
}

// Slider for controlling the zoom level
export function sliderZoom(v) {
  zoom = 0.1 + (1-v) * 9.9;  // Adjust range as needed, currently 0.1 to 10
}

export function render2D(index, x, y) { 
  x = x * zoom - (zoom - 1) / 2;  // Adjust for zoom, and re-center
  y = y * zoom - (zoom - 1) / 2;  // Adjust for zoom, and re-center

  h = (1 + sin(x * z + t1) + cos(y * z + t2)) * 0.5;
  
  v = h;
  v = v * v * v / 2;  // Brightness scaling

  hsv(h, 1, v);
}

export function render(index) {
  pct = index / pixelCount;  
  render2D(index, 8 * pct, 0);  
}
