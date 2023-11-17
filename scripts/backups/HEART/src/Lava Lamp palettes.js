// a bunch of fastled gradient palettes
var black_Blue_Magenta_White_gp = [
  0,   0,  0,  0,
  42,   0,  0, 45,
  84,   0,  0,255,
  127,  42,  0,255,
  170, 255,  0,255,
  212, 255, 55,255,
  255, 255,255,255]
// normalize palette to 0.0 to 1.0 range  
arrayMutate(black_Blue_Magenta_White_gp,(v, i ,a) => v / 255);  

var es_landscape_33_gp = [
  0,   1,  5,  0,
  19,  32, 23,  1,
  38, 161, 55,  1,
  63, 229,144,  1,
  66,  39,142, 74,
  255,   1,  4,  1]
// normalize palette to 0.0 to 1.0 range    
arrayMutate(es_landscape_33_gp,(v, i ,a) => v / 255);

var heatmap_gp = [
  0,     0,  0,  0,   
  128,   255,  0,  0,   
  224,   255,255,  0,   
  255,   255,255,255 ];
// normalize palette to 0.0 to 1.0 range   
arrayMutate(heatmap_gp,(v, i ,a) => v / 255);

// list of the palettes we'll be using
var palettes = [black_Blue_Magenta_White_gp,es_landscape_33_gp,heatmap_gp]

// control variables for palette switch timing (these are in seconds)
export var PALETTE_HOLD_TIME = 5
export var PALETTE_TRANSITION_TIME = 2;

// internal variables used by the palette manager.
// Usually not necessary to change these.
export var currentIndex = 0;
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

export var scaleFactor = 0.25
// Startup initialization for palette manager
setPalette(currentPalette);
buildBlendedPalette(palettes[currentIndex],palettes[nextIndex],blendValue)  

// UI Controls

// transition to the next palette in the sequence
export function triggerNextPalette() {
  runTime = 0;
  inTransition = 1
}

// how long we stick with a palette before transitioning to
// the next one
export function sliderHoldTime(v) {
  PALETTE_HOLD_TIME = 20 * v * v;
}

export function sliderScaleFactor(v) {
  scaleFactor = 1 + (1 - v) * 19 // Subtract v from 1 to reverse the slider.
}

// time to cross-blend between palettes when switching
export function sliderTransitionTime(v) {
  PALETTE_TRANSITION_TIME = 10 * v * v;
}

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
    var v = i / (PALETTE_SIZE - 1);
    
    paint2(v,pixel1,pal1);
    paint2(v,pixel2,pal2);  
    
    // build new palette at currrent blend level
    currentPalette[entry++] = v;
    currentPalette[entry++] = mix(pixel1[0],pixel2[0],blend)
    currentPalette[entry++] = mix(pixel1[1],pixel2[1],blend)
    currentPalette[entry++] = mix(pixel1[2],pixel2[2],blend)    
  }
}







// We're using the Perlin FBM function to generate a star field that we can fly through.
// Lacunarity, gain, and octaves control the character of the Perlin FBM function.

export var lacunarity = 2 // The lacunarity controls the frequency of the octaves.
export var gain = 0.5 // The gain controls the amplitude of the octaves.
export var octaves = 4 // The number of noise functions summed together.

// Zoom value, allows to control the density of the star field.
export var zoom = 1.0 

// Slider for zoom value, range from 1 to 20.
// The slider is reversed, i.e., moving the slider to the right (towards 1), decreases zoom,
// creating an effect of being further from the stars.
export function sliderZoom(v) {
  zoom = 1 + (1 - v) * 19 // Subtract v from 1 to reverse the slider.
}

// Slider to control lacunarity, between 1.0 and 3.0
export function sliderLacunarity(v) {
  lacunarity = 1 + v * 2
}

// Slider to control gain, between 0.0 and 1.0
export function sliderGain(v) {
  gain = v
}

// Slider to control octaves, between 1 and 8
export function sliderOctaves(v) {
  octaves = 1 + floor(v * 7)
}

// Time variable to create animation.
var t = 0 
export var theta
export function beforeRender(delta) {
  theta = PI2 * time(0.2);
  resetTransform()
  // rotateY(theta)
  rotateX(theta)
  scale(scaleFactor,scaleFactor);
  runTime = (runTime + delta / 1000) % 3600;
  t += delta / 2000 // Adjust speed of travel.
  
  // Palette Manager - handle palette switching and blending with a 
  // tiny state machine  
  if (inTransition) {
    if (runTime >= PALETTE_TRANSITION_TIME) {
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
      blendValue = runTime / PALETTE_TRANSITION_TIME
    }
    
    // blended palette is only recalculated during transition times. The rest of 
    // the time, we run with the current palette at full speed.
    buildBlendedPalette(palettes[currentIndex],palettes[nextIndex],blendValue)          
  }
  else if (runTime >= PALETTE_HOLD_TIME) {
    // when hold period ends, switch to palette transition
    runTime = 0
    inTransition = 1
  }
}
// setPerlinWrap(3,256,256);
export var n
setPerlinWrap(3,256,256);

function renderPattern(index, x, y) {
  // Generate Fractal Brownian Motion with coordinates scaled by zoom factor.
  var n = perlinFbm(x, y, t, lacunarity, gain, octaves) 
  // var n = perlinRidge(x*zoom, y*zoom, t, lacunarity, gain, 1, octaves)
  // v = max(smoothstep(flareAmount,1,v),(1-((y*v)-c2)/coreSize));  
  // The output of the Perlin function is between -1 and 1, so we shift and
  // scale it to be a brightness value between 0 and 1.
  n = (wave(n) + 1) / 2.5 
  // n = smoothstep(0.5,1,n)
  // Determine hue based on brightness (Perlin noise value).
  // var hue = n 
  var hue = n - (0.125*n)

  // Set the current pixel to the calculated hue, saturation, and brightness.
  // hsv(hue, 1, n)
  paint(hue, 1);
}


// Add your pattern render() code here -- just use paint to get color
// from the current blended palette.
export function render(index) {
  pct = index / pixelCount  // Transform index..pixelCount to 0..1
  render2D(index, 3 * pct, 0)   // Render 3 top rows worth to make it denser
}

export function render2D(index, x, y) {
  renderPattern(index, x, y)
}

// You can also project up a dimension. Think of this as mixing in the z value
// to x and y in order to compose a stack of matrices.
export function render3D(index, x, y, z) {
  x1 = (x - cos(z / 4 * PI2)) / 2
  y1 = (y - sin(z / 4 * PI2)) / 2
  render2D(index, x1, y1)
}