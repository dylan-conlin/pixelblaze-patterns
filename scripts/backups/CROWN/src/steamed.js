// Variables for animation, now initialized with default values
export var tf = 4, f = 2, t1_shift = 1, t2_shift = 1, t3_shift = 0.5, t4_shift = 0.5;
export var t1_oscillation = 0.5, t2_oscillation = 0.5;

// Slider for animation speed
export function sliderSpeed(v) {
  tf = 1 + 9 * v;  // Range from 1 to 10
}

// Slider for frequency
export function sliderFrequency(v) {
  f = 1 + 50 * v;  // Range from 1 to 50
}

// Slider for t1 shift
export function sliderT1Shift(v) {
  t1_shift = v;  // Range from 0 to 1
}

// Slider for t2 shift
export function sliderT2Shift(v) {
  t2_shift = v;  // Range from 0 to 1
}

// Slider for t3 shift (hue)
export function sliderT3Shift(v) {
  t3_shift = v;  // Range from 0 to 1
}

// Slider for t4 shift
export function sliderT4Shift(v) {
  t4_shift = v;  // Range from 0 to 1
}

// Slider for t1 oscillation
export function sliderT1Oscillation(v) {
  t1_oscillation = v;  // Range from 0 to 1
}

// Slider for t2 oscillation
export function sliderT2Oscillation(v) {
  t2_oscillation = v;  // Range from 0 to 1
}

// Before each rendering cycle
export function beforeRender(delta) {
  // Oscillate t1_shift and t2_shift
  t1_shift += t1_oscillation * sin(time(tf * 0.1));
  t2_shift += t2_oscillation * cos(time(tf * 0.1));

  // Using slider-controlled variables in the computations
  t1 = triangle(time(tf * 9.8 / 65.536) * t1_shift) * PI2;
  t2 = wave(time(tf * 12.5 / 65.536) * t2_shift) * PI2;
  t3 = wave(time(tf * 6.8 / 65.536) * t3_shift);
  t4 = time(tf * 0.8 / 65.536 * t4_shift);
}

// Rest of the rendering functions remain unchanged
export function render2D(index, x, y) {
  z = mix(sin(x * f + t1), cos(y * f + t2), 0.5);
  v = wave(z + t4);
  v = v * v * v;
  h = triangle(z) / 2 + t3;
  hsv(h, 1, v);
}

export function render(index) {
  pct = index / pixelCount;
  render2D(index, 3 * pct, 0);
}

export function render3D(index, x, y, z) {
  x1 = (x - cos(z / 4 * PI2)) / 2;
  y1 = (y - sin(z / 4 * PI2)) / 2;
  render2D(index, x1, y1);
}
