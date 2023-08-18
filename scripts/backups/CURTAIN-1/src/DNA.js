// Palette arrays
var viridis = [0.0, 68/255, 1/255, 84/255, 0.1, 72/255, 36/255, 117/255, 0.2, 65/255, 68/255, 135/255, 0.3, 53/255, 95/255, 141/255, 0.4, 42/255, 120/255, 142/255, 0.5, 33/255, 145/255, 140/255, 0.6, 34/255, 168/255, 132/255, 0.7, 68/255, 191/255, 112/255, 0.8, 122/255, 209/255, 81/255, 0.9, 189/255, 223/255, 38/255, 1.0, 253/255, 231/255, 37/255,];
var plasma  = [0.0, 13/255, 8/255, 135/255, 0.1, 65/255, 4/255, 157/255, 0.2, 106/255, 0/255, 168/255, 0.3, 143/255, 13/255, 164/255, 0.4, 177/255, 42/255, 129/255, 0.5, 204/255, 71/255, 120/255, 0.6, 225/255, 100/255, 98/255, 0.7, 242/255, 132/255, 75/255, 0.8, 252/255, 166/255, 54/255, 0.9, 252/255, 206/255, 37/255, 1.0, 240/255, 249/255, 33/255, ];
setPalette(plasma);

// Default values
export var speed = .03;
export var strandWidth = 0.1;
export var freq = 1;
export var myMode = 1;
export var distance = 0.4;
var t;

// Slider functions
export function sliderSpeed(v) { speed = 3 + ((1-v) * 10); }
export function sliderStrandWidth(v) { strandWidth = 0.05 + v; }
export function sliderFrequency(v) { freq = .1 + (v * 18); }
export function sliderMode(v) { myMode = ceil((v * 2)); }
export function sliderDistance(v) { distance = v; }

// Reset toggle
export function toggleResetToDefaults(v) {
  if (v) {
    speed = .03;
    strandWidth = 0.1;
    freq = 1;
    myMode = 1;
    distance = 0.4;
  }
}

function beforeSinushimmer(delta) {
  t = time(speed / (65.536));
}

// Sinushimmer function
function sinushimmer(index, r, phi, theta) {
  var mode, line;
  
  // Determine mode based on myMode
  if (myMode === 0) {
    mode = bezierQuadratic(t, 0, 18, 0);
  } else if (myMode === 1) {
    mode = 0.2 + wave(t);
  } else if (myMode === 2) {
    var count = wave(t);
    mode = count + freq;
  }
  
  // Generate line
  line = near(r, 0.5 + distance * cos((mode*phi - t) * (PI2)), strandWidth);
  
  // Paint line
  paint(line, 1);
}

// Render functions
export function beforeRender(delta) { beforeSinushimmer(delta); }
export function render3D(index, r, phi, theta) {
  sinushimmer(index, r, phi, theta)
}
export function render2D(index, r, phi) {
  render3D(index, r, phi, .5) // Equatorial section
}

export function render(index) {
  render2D(index, index / pixelCount, 0)
}

// Utilities

// Several modes define a line in space. This sets the defualt thickness of
// those. Use a higher percentage for projects with fewer pixels.
var halfwidthDefault = 0.125

// Returns 1 when a & b are proximate, 0 when they are more than `halfwidth`
// apart, and a gamma-corrected brightness for distances within `halfwidth`
function near(a, b, halfwidth) {
  if (halfwidth == 0) halfwidth = halfwidthDefault
  var v = clamp(1 - abs(a - b) / halfwidth, 0, 1)
  return v * v
}

