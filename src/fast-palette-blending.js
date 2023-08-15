var Analogous_1 = [0.0, 0.012, 0.0, 1.0,    0.247, 0.09, 0.0, 1.0,    0.498, 0.263, 0.0, 1.0,   0.749, 0.557, 0.0, 0.176,   1.0, 1.0, 0.0, 0.0,];
var BlacK_Blue_Magenta_White = [0.0, 0.0, 0.0, 0.0,   0.165, 0.0, 0.0, 0.176,   0.329, 0.0, 0.0, 1.0,   0.498, 0.165, 0.0, 1.0,   0.667, 1.0, 0.0, 1.0,   0.831, 1.0, 0.216, 1.0,   1.0, 1.0, 1.0, 1.0,];
var BlacK_Red_Magenta_Yellow = [0.0, 0.0, 0.0, 0.0,   0.165, 0.165, 0.0, 0.0,   0.329, 1.0, 0.0, 0.0,   0.498, 1.0, 0.0, 0.176,   0.667, 1.0, 0.0, 1.0,   0.831, 1.0, 0.216, 0.176,   1.0, 1.0, 1.0, 0.0,];
var Blue_Cyan_Yellow = [0.0, 0.0, 0.0, 1.0,   0.247, 0.0, 0.216, 1.0,   0.498, 0.0, 1.0, 1.0,   0.749, 0.165, 1.0, 0.176,   1.0, 1.0, 1.0, 0.0,];
var GMT_drywet = [0.0, 0.184, 0.118, 0.008,   0.165, 0.835, 0.576, 0.094,   0.329, 0.404, 0.859, 0.204,   0.498, 0.012, 0.859, 0.812,   0.667, 0.004, 0.188, 0.839,   0.831, 0.004, 0.004, 0.435,   1.0, 0.004, 0.027, 0.129,];
var Sunset_Real = [0.0, 0.471, 0.0, 0.0,    0.086, 0.702, 0.086, 0.0,   0.2, 1.0, 0.408, 0.0,   0.333, 0.655, 0.086, 0.071,   0.529, 0.392, 0.0, 0.404,   0.776, 0.063, 0.0, 0.51,    1.0, 0.0, 0.0, 0.627,];
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

var palettes = [
  Analogous_1,
  BlacK_Blue_Magenta_White,
  BlacK_Red_Magenta_Yellow,
  Blue_Cyan_Yellow,
  GMT_drywet,
  Sunset_Real,
  bhw1_04_gp,
  black_Blue_Magenta_White_gp,
  es_landscape_33_gp,
  gr65_hult,
  heatmap_gp,
  inferno,
  lava,
  rainbowsherbet,
]

export var paletteHoldTime = 5;
export var paletteTransitionTime = 2;

export function sliderPaletteHoldTime(v) {
  paletteHoldTime = 1 + v * 20;
}

export function sliderPaletteTransitionTime(v) {
  paletteTransitionTime = 0.1 + v * 10;
}

// internal variables used by the palette manager.
// Usually not necessary to change these.
var currentIndex = 0;
var nextIndex = (currentIndex + 1) % palettes.length;

// arrays to hold rgb interpolation results
var pixel1 = array(3);
var pixel2 = array(3);

// array to hold calculated blended palette
var PALETTE_SIZE = 16;
var currentPalette = array(4 * PALETTE_SIZE)

// timing related variables
var inTransition = 0;
var blendValue = 0;
runTime = 0

// Startup initialization for palette manager
setPalette(currentPalette);
buildBlendedPalette(palettes[currentIndex],palettes[nextIndex],blendValue)

// user space version of Pixelblaze's paint function. Stores
// interpolated rgb color in rgbArray
function paint2(v, rgbArray, pal) {
  var k,u,l;
  var rows = pal.length / 4;

  // find the top bounding palette row
  for (i = 0; i < rows;i++) {
    k = pal[i * 4];
    if (k >= v) break;
  }

  // fast path for special cases
  if ((i == 0) || (i >= rows) || (k == v)) {
    i = 4 * min(rows - 1, i);
    rgbArray[0] = pal[i+1];
    rgbArray[1] = pal[i+2];
    rgbArray[2] = pal[i+3];
  }
  else {
    i = 4 * (i-1);
    l = pal[i]   // lower bound
    u = pal[i+4]; // upper bound

    pct = 1 -(u - v) / (u-l);

    rgbArray[0] = mix(pal[i+1],pal[i+5],pct);
    rgbArray[1] = mix(pal[i+2],pal[i+6],pct);
    rgbArray[2] = mix(pal[i+3],pal[i+7],pct);
  }
}

// utility function:
// interpolate colors within and between two palettes
// and set the LEDs directly with the result.  To be
// used in render() functions
function paletteMix(pal1, pal2, colorPct,palettePct) {
  paint2(colorPct,pixel1,pal1);
  paint2(colorPct,pixel2,pal2);

  rgb(mix(pixel1[0],pixel2[0],palettePct),
      mix(pixel1[1],pixel2[1],palettePct),
      mix(pixel1[2],pixel2[2],palettePct)
     )
}

// construct a new palette in the currentPalette array by blending
// between pal1 and pal2 in proportion specified by blend
function buildBlendedPalette(pal1, pal2, blend) {
  var entry = 0;

  for (var i = 0; i < PALETTE_SIZE;i++) {
    var v = i / PALETTE_SIZE;

    paint2(v,pixel1,pal1);
    paint2(v,pixel2,pal2);

    // build new palette at currrent blend level
    currentPalette[entry++] = v;
    currentPalette[entry++] = mix(pixel1[0],pixel2[0],blend)
    currentPalette[entry++] = mix(pixel1[1],pixel2[1],blend)
    currentPalette[entry++] = mix(pixel1[2],pixel2[2],blend)
  }
}

export function beforeRender(delta) {
  runTime = (runTime + delta / 1000) % 3600;

  // Palette Manager - handle palette switching and blending with a
  // tiny state machine
  if (inTransition) {
    if (runTime >= paletteTransitionTime) {
      // at the end of a palette transition, switch to the
      // next set of palettes and reset everything for the
      // normal hold period.
      runTime = 0;
      inTransition = 0
      blendValue = 0
      currentIndex = (currentIndex + 1) % palettes.length
      nextIndex = (nextIndex + 1) % palettes.length

    }
    else {
      // evaluate blend level during transition
      blendValue = runTime / paletteTransitionTime
    }

    // blended palette is only recalculated during transition times. The rest of
    // the time, we run with the current palette at full speed.
    buildBlendedPalette(palettes[currentIndex],palettes[nextIndex],blendValue)
  }
  else if (runTime >= paletteHoldTime) {
    // when hold period ends, switch to palette transition
    runTime = 0
    inTransition = 1
  }

  // beforeRender() code specific to your pattern can go below this line

}

// Add your pattern render() code here -- just use paint to get color
// from the current blended palette.
export function render(index) {
  pct = frac(wave(time(0.1))+ index/pixelCount)
  paint(pct);
}
