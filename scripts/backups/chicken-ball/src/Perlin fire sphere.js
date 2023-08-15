/* 
   Demonstration of Perlin noise functions to generate fire 
   The first mode shows Perlin noise scaled to 0-1.
   The second shows a fractal ridge function, creating fire tendrils.
   The third fractal Brownian Motion (fBm), a fairly decent aproximation of fire.
   The fourth uses a fractal turbulence function, and looks like a blackened rolling fireball.

   2022 Ben Hencke (wizard)
*/



var fire = [
  0,    0, 0, 0,
  0.2,  1, 0, 0,
  0.8,  1, 1, 0,
  1,    1, 1, 1
]
var Analogous_1 = [0.0, 0.012, 0.0, 1.0,    0.247, 0.09, 0.0, 1.0,    0.498, 0.263, 0.0, 1.0,   0.749, 0.557, 0.0, 0.176,   1.0, 1.0, 0.0, 0.0,];
var BlacK_Blue_Magenta_White = [0.0, 0.0, 0.0, 0.0,   0.165, 0.0, 0.0, 0.176,   0.329, 0.0, 0.0, 1.0,   0.498, 0.165, 0.0, 1.0,   0.667, 1.0, 0.0, 1.0,   0.831, 1.0, 0.216, 1.0,   1.0, 1.0, 1.0, 1.0,];
var BlacK_Red_Magenta_Yellow = [0.0, 0.0, 0.0, 0.0,   0.165, 0.165, 0.0, 0.0,   0.329, 1.0, 0.0, 0.0,   0.498, 1.0, 0.0, 0.176,   0.667, 1.0, 0.0, 1.0,   0.831, 1.0, 0.216, 0.176,   1.0, 1.0, 1.0, 0.0,];
var Blue_Cyan_Yellow = [0.0, 0.0, 0.0, 1.0,   0.247, 0.0, 0.216, 1.0,   0.498, 0.0, 1.0, 1.0,   0.749, 0.165, 1.0, 0.176,   1.0, 1.0, 1.0, 0.0,];
var GMT_drywet = [0.0, 0.184, 0.118, 0.008,   0.165, 0.835, 0.576, 0.094,   0.329, 0.404, 0.859, 0.204,   0.498, 0.012, 0.859, 0.812,   0.667, 0.004, 0.188, 0.839,   0.831, 0.004, 0.004, 0.435,   1.0, 0.004, 0.027, 0.129,];
var bhw1_04_gp = [0, 229,227,  1,   15, 227,101,  3,    142,  40,  1, 80,   198,  17,  1, 79,   255,   0,  0, 45]
var black_Blue_Magenta_White_gp = [0,   0,  0,  0, 42,   0,  0, 45, 84,   0,  0,255, 127,  42,  0,255, 170, 255,  0,255, 212, 255, 55,255, 255, 255,255,255]
var es_landscape_33_gp = [0,   1,  5,  0, 19,  32, 23,  1, 38, 161, 55,  1, 63, 229,144,  1, 66,  39,142, 74, 255,   1,  4,  1]
var gr65_hult = [0.0, 0.969, 0.69, 0.969,   0.188, 1.0, 0.533, 1.0,   0.349, 0.863, 0.114, 0.886,   0.627, 0.027, 0.322, 0.698,   0.847, 0.004, 0.486, 0.427,   1.0, 0.004, 0.486, 0.427,];
var heatmap_gp = [0,     0,  0,  0, 128,   255,  0,  0, 224,   255,255,  0, 255,   255,255,255 ];
var inferno = [ 0.0, 0/255, 0/255, 4/255, 0.1, 22/255, 11/255, 57/255, 0.2, 66/255, 10/255, 104/255, 0.3, 106/255, 23/255, 110/255, 0.4, 147/255, 38/255, 103/255, 0.5, 188/255, 55/255, 84/255, 0.6, 221/255, 81/255, 58/255, 0.7, 243/255, 120/255, 25/255, 0.8, 252/255, 165/255, 10/255, 0.9, 246/255, 215/255, 70/255, 1.0, 252/255, 255/255, 164/255, ]
var lava = [0.0, 0.0, 0.0, 0.0,   0.18, 0.071, 0.0, 0.0,    0.376, 0.443, 0.0, 0.0,   0.424, 0.557, 0.012, 0.004,   0.467, 0.686, 0.067, 0.004,   0.573, 0.835, 0.173, 0.008,   0.682, 1.0, 0.322, 0.016,   0.737, 1.0, 0.451, 0.016,   0.792, 1.0, 0.612, 0.016,   0.855, 1.0, 0.796, 0.016,   0.918, 1.0, 1.0, 0.016,   0.957, 1.0, 1.0, 0.278,   1.0, 1.0, 1.0, 1.0,];
var rainbowsherbet = [0.0, 1.0, 0.129, 0.016,   0.169, 1.0, 0.267, 0.098,   0.337, 1.0, 0.027, 0.098,   0.498, 1.0, 0.322, 0.404,   0.667, 1.0, 1.0, 0.949,   0.82, 0.165, 1.0, 0.086,    1.0, 0.341, 1.0, 0.255,];

arrayMutate(bhw1_04_gp,(v, i ,a) => v / 255);
arrayMutate(black_Blue_Magenta_White_gp,(v, i ,a) => v / 255);
arrayMutate(es_landscape_33_gp,(v, i ,a) => v / 255);
arrayMutate(heatmap_gp,(v, i ,a) => v / 255);



var sunset = [0.0, 0.471, 0.0, 0.0,    0.086, 0.702, 0.086, 0.0,   0.2, 1.0, 0.408, 0.0,   0.333, 0.655, 0.086, 0.071,   0.529, 0.392, 0.0, 0.404,   0.776, 0.063, 0.0, 0.51,    1.0, 0.0, 0.0, 0.627,];
// List of palettes
// good fire palettes:
var palettes = [
  fire,
  inferno,
  lava,
  BlacK_Blue_Magenta_White,
  Blue_Cyan_Yellow,
  black_Blue_Magenta_White_gp,
  gr65_hult,
]

// These don't look that great as fire palettes:
// Analogous_1,
// BlacK_Red_Magenta_Yellow,
// GMT_drywet,
// bhw1_04_gp,
// es_landscape_33_gp,
// rainbowsherbet,
// heatmap_gp,

var currentPalette = random(palettes.length);
//var currentPalette = 0
setPalette(palettes[currentPalette]);

export function showNumberPaletteMode() {
  return currentPalette + 1;
}

//variants of noise can be chosen from
modes = [
  (x,y,z) => (perlin(x, y, z, 0) + 1)/2, //by default perlin returns negative values too, scale this to 0-1
  (x,y,z) => perlinRidge(x, y, z, 2, .5, 1.1, 3),
  (x,y,z) => (perlinFbm(x, y, z, 2, .5, 3)+1)/2, //this can also generate negative values
  (x,y,z) => perlinTurbulence(x, y, z, 2, .5, 3),
]
export var mode = 1
export var fireScale = 3
export var risingSpeed = 1
export var morphSpeed = 1
export var intensity = 1

export function sliderMode(v) {
  mode = round(v*(modes.length - 1))
}
export function showNumberMode() {
  return mode + 1
}
export function sliderIntensity(v) {
  intensity = 0.1 + v*10 
}
export function sliderScale(v) {
  fireScale = v
}
export function sliderRisingSpeed(v) {
  v = 1-v
  risingSpeed = 0.2 + (v*v) * 5
}
export function sliderMorphSpeed(v) {
  v = 1-v
  morphSpeed = 0.2 + (v*v) * 5
}

export function toggleDisableSliders(v) {
  if (v) {
    fireScale =	11.000000
    mode = 0.000000
    morphSpeed = 1.235062
    risingSpeed = 5.199982
  }
}
var timeCounter = 0; // Initialize a counter to keep track of time

export function beforeRender(delta) {
  timeCounter += delta; // Increment the time counter by the time since the last frame

  //by default perlin wraps smoothly every 256, so 0.0 and 256 are the same
  //animate the perlin noise by moving z across time from 0-256
  //this also means increasing the interval we use with time() to slow it down
  //and happens to give us a lot of unique noise
  morphTime = time(6 * morphSpeed) * 256
  yTime = time(1.3 * risingSpeed) * 256
  modeFn = modes[mode]
  resetTransform()
  translate(-.5, 0)
  scale(fireScale,fireScale)
}

export function render2D(index, x, y) {
  //call out to a noise function based on the mode, animating y to rise and using z to morph the fire over time
  v = modeFn(x, y + yTime, morphTime ) 
  
  //create a hotter column around the center of x, fading towards the edges
  v = v * 2*(1 - abs(x/fireScale*1.8)) 
  
  //fade out the higher it gets
  v = v * y/fireScale 
  
  //keep palette from wrapping if noise goes past 1.0
  v = min(v,1) 
  paint(v, v)
}

export function render3D(index, x, y, z) {
  // Calculate the distance of the LED from the center of the sphere
  var distanceFromCenter = sqrt(x*x + y*y + z*z);

  // Angle relative to the y-axis (from south pole)
  var theta = acos(y/distanceFromCenter);

  // Azimuthal angle (around y-axis)
  var phi = atan2(z, x);

  // Adjust the y-coordinate to make the fire wrap around the sphere
  yAdjusted = yTime + (1 - theta/PI) + 0.2*sin(phi);  // sin(phi) is added to make the fire wrap around
  
  // Call out to the noise function based on the mode
  v = modeFn(x, yAdjusted, morphTime); 
  
  // Modulate the intensity based on angle theta (distance from the south pole)
  v = v * (intensity - theta/PI);
  
  // // Modulate the intensity further based on the vertical position
  // v = v * (1 + y)/fireScale;  // Notice the +y instead of -y  

  // Keep the palette from wrapping if noise goes past 1.0
  v = min(v, 1);
  paint(v, v);
}

