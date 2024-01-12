var HALF_PI = PI/2;
var speed = 1; // Default speed
var colorVariation = 0.5; // Default color variation
var brightnessContrast = 10; // Default contrast value
var depthEffectOscillation = false;  // Toggle state for depth effect oscillation
export var depthEffect = 0.0002;  // Default depth effect
var minDepthEffect = -0.0002
var maxDepthEffect = 0.002;  // Maximum depth effect for oscillation// Toggle for oscillating depth effect
var saturation = 1; // Default saturation
export var t, x1, y1, z1, oscillatingDepthEffect = 0.2;

function arctan2(y, x) {
  if (x > 0) return atan(y/x);
  if (y > 0) return HALF_PI - atan(x/y);
  if (y < 0) return -HALF_PI - atan(x/y);
  if (x < 0) return PI + atan(y/x);
  return 1.0;
}

function getUnitAngle(x, y) {
  return (PI + arctan2(x - .5, y - .5))/PI2; 
}

function getRadius2D(x, y) {
  x -= 0.5; y -= 0.5;
  return sqrt(x*x + y*y);
}

function getRadius3D(x, y, z) {
  x -= 0.5; y -= 0.5; z -= 0.5;
  return sqrt(x*x + y*y + z*z);
}

export function toggleDepthEffectOscillation(v) {
  depthEffectOscillation = (v == 1);
}

export function sliderSpeed(v) {
  speed = 1 + v * 2; // Range: 1 to 3
}

export function sliderColorVariation(v) {
  colorVariation = v; // Range: 0 to 1
}

export function sliderBrightnessContrast(v) {
  brightnessContrast = 1 + v * 19; // Range: 1 to 20
}

export function sliderDepthEffect(v) {
  depthEffect = v * 0.1; // Range: 0 to 0.1
}

export function sliderSaturation(v) {
  saturation = v; // Range: 0 to 1
}

var oscillatingDepthEffect = 0.0002;
export function beforeRender(delta) {
  t1 = time(0.1 * speed);

  // Smooth oscillation for depthEffect
  if (depthEffectOscillation) {
    // Oscillate between minDepthEffect and maxDepthEffect
    oscillatingDepthEffect = minDepthEffect - (maxDepthEffect - minDepthEffect) * 
                              (0.5 + 0.5 * sin(time(0.1) * PI2));
  } else {
    oscillatingDepthEffect = depthEffect;
  }
}

export function render3D(index, x, y, z) {
  if (index == 0) {
    t = getRadius3D(x, y, z);
    x1 = x; y1 = y; z1 = z;
  }

  v = triangle(getUnitAngle(x, y) + time((0.05 + z * oscillatingDepthEffect) * speed));
  v = pow(v, brightnessContrast); // Adjusted contrast
  h = getRadius3D(x, y, z) * colorVariation;

  hsv(h, saturation, v);
}

export function render2D(index, x, y) {
  render3D(index, x, y, .5);
}
