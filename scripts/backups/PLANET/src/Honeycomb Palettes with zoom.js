// palette vars start
var lava = [0.0, 68/255, 1/255, 84/255, 0.18, 0.071, 0.0, 0.0, 0.376, 0.443, 0.0, 0.0, 0.424, 0.557, 0.012, 0.004, 0.467, 0.686, 0.067, 0.004, 0.573, 0.835, 0.173, 0.008, 0.682, 1.0, 0.322, 0.016, 0.737, 1.0, 0.451, 0.016, 0.792, 1.0, 0.612, 0.016, 0.855, 1.0, 0.796, 0.016, 0.918, 1.0, 1.0, 0.016, 0.957, 1.0, 1.0, 0.278, 1.0, 1.0, 1.0, 1.0,];
var ib_jul01 = [0.0, 0.761, 0.004, 0.004, 0.369, 0.004, 0.114, 0.071, 0.518, 0.224, 0.514, 0.11, 1.0, 0.443, 0.004, 0.004,];
var es_vintage_57 = [0.0, 0.008, 0.004, 0.004, 0.208, 0.071, 0.004, 0.0, 0.408, 0.271, 0.114, 0.004, 0.6, 0.655, 0.529, 0.039, 1.0, 0.18, 0.22, 0.016,];
var es_vintage_01 = [0.0, 0.016, 0.004, 0.004, 0.2, 0.063, 0.0, 0.004, 0.298, 0.38, 0.408, 0.012, 0.396, 1.0, 0.514, 0.075, 0.498, 0.263, 0.035, 0.016, 0.6, 0.063, 0.0, 0.004, 0.898, 0.016, 0.004, 0.004, 1.0, 0.016, 0.004, 0.004,];
var es_rivendell_15 = [0.0, 0.004, 0.055, 0.02, 0.396, 0.063, 0.141, 0.055, 0.647, 0.22, 0.267, 0.118, 0.949, 0.588, 0.612, 0.388, 1.0, 0.588, 0.612, 0.388,];
var rgi_15 = [0.0, 0.016, 0.004, 0.122, 0.122, 0.216, 0.004, 0.063, 0.247, 0.773, 0.012, 0.027, 0.373, 0.231, 0.008, 0.067, 0.498, 0.024, 0.008, 0.133, 0.624, 0.153, 0.024, 0.129, 0.749, 0.439, 0.051, 0.125, 0.875, 0.22, 0.035, 0.137, 1.0, 0.086, 0.024, 0.149,];
var retro2_16 = [0.0, 0.737, 0.529, 0.004, 1.0, 0.18, 0.027, 0.004,];
var Analogous_1 = [0.0, 0.012, 0.0, 1.0, 0.247, 0.09, 0.0, 1.0, 0.498, 0.263, 0.0, 1.0, 0.749, 0.557, 0.0, 0.176, 1.0, 1.0, 0.0, 0.0,];
var es_pinksplash_08 = [0.0, 0.494, 0.043, 1.0, 0.498, 0.773, 0.004, 0.086, 0.686, 0.824, 0.616, 0.675, 0.867, 0.616, 0.012, 0.439, 1.0, 0.616, 0.012, 0.439,];
var es_pinksplash_07 = [0.0, 0.898, 0.004, 0.004, 0.239, 0.949, 0.016, 0.247, 0.396, 1.0, 0.047, 1.0, 0.498, 0.976, 0.318, 0.988, 0.6, 1.0, 0.043, 0.922, 0.757, 0.957, 0.02, 0.267, 1.0, 0.91, 0.004, 0.02,];
var Coral_reef = [0.0, 0.157, 0.78, 0.773, 0.196, 0.039, 0.596, 0.608, 0.376, 0.004, 0.435, 0.471, 0.376, 0.169, 0.498, 0.635, 0.545, 0.039, 0.286, 0.435, 1.0, 0.004, 0.133, 0.278,];
var es_ocean_breeze_068 = [0.0, 0.392, 0.612, 0.6, 0.2, 0.004, 0.388, 0.537, 0.396, 0.004, 0.267, 0.329, 0.408, 0.137, 0.557, 0.659, 0.698, 0.0, 0.247, 0.459, 1.0, 0.004, 0.039, 0.039,];
var es_ocean_breeze_036 = [0.0, 0.004, 0.024, 0.027, 0.349, 0.004, 0.388, 0.435, 0.6, 0.565, 0.82, 1.0, 1.0, 0.0, 0.286, 0.322,];
var departure = [0.0, 0.031, 0.012, 0.0, 0.165, 0.09, 0.027, 0.0, 0.247, 0.294, 0.149, 0.024, 0.329, 0.663, 0.388, 0.149, 0.416, 0.835, 0.663, 0.467, 0.455, 1.0, 1.0, 1.0, 0.541, 0.529, 1.0, 0.541, 0.58, 0.086, 1.0, 0.094, 0.667, 0.0, 1.0, 0.0, 0.749, 0.0, 0.533, 0.0, 0.831, 0.0, 0.216, 0.0, 1.0, 0.0, 0.216, 0.0,];
var es_landscape_64 = [0.0, 0.0, 0.0, 0.0, 0.145, 0.008, 0.098, 0.004, 0.298, 0.059, 0.451, 0.02, 0.498, 0.31, 0.835, 0.004, 0.502, 0.494, 0.827, 0.184, 0.51, 0.737, 0.82, 0.969, 0.6, 0.565, 0.714, 0.804, 0.8, 0.231, 0.459, 0.98, 1.0, 0.004, 0.145, 0.753,];
var es_landscape_33 = [0.0, 0.004, 0.02, 0.0, 0.075, 0.125, 0.09, 0.004, 0.149, 0.631, 0.216, 0.004, 0.247, 0.898, 0.565, 0.004, 0.259, 0.153, 0.557, 0.29, 1.0, 0.004, 0.016, 0.004,];
var rainbowsherbet = [0.0, 1.0, 0.129, 0.016, 0.169, 1.0, 0.267, 0.098, 0.337, 1.0, 0.027, 0.098, 0.498, 1.0, 0.322, 0.404, 0.667, 1.0, 1.0, 0.949, 0.82, 0.165, 1.0, 0.086, 1.0, 0.341, 1.0, 0.255,];
var gr65_hult = [0.0, 0.969, 0.69, 0.969, 0.188, 1.0, 0.533, 1.0, 0.349, 0.863, 0.114, 0.886, 0.627, 0.027, 0.322, 0.698, 0.847, 0.004, 0.486, 0.427, 1.0, 0.004, 0.486, 0.427,];
var gr64_hult = [0.0, 0.004, 0.486, 0.427, 0.259, 0.004, 0.365, 0.31, 0.408, 0.204, 0.255, 0.004, 0.51, 0.451, 0.498, 0.004, 0.588, 0.204, 0.255, 0.004, 0.788, 0.004, 0.337, 0.282, 0.937, 0.0, 0.216, 0.176, 1.0, 0.0, 0.216, 0.176,];
var GMT_drywet = [0.0, 0.184, 0.118, 0.008, 0.165, 0.835, 0.576, 0.094, 0.329, 0.404, 0.859, 0.204, 0.498, 0.012, 0.859, 0.812, 0.667, 0.004, 0.188, 0.839, 0.831, 0.004, 0.004, 0.435, 1.0, 0.004, 0.027, 0.129,];
var ib15 = [0.0, 0.443, 0.357, 0.576, 0.282, 0.616, 0.345, 0.306, 0.349, 0.816, 0.333, 0.129, 0.42, 1.0, 0.114, 0.043, 0.553, 0.537, 0.122, 0.153, 1.0, 0.231, 0.129, 0.349,];
var Fuschia_7 = [0.0, 0.169, 0.012, 0.6, 0.247, 0.392, 0.016, 0.404, 0.498, 0.737, 0.02, 0.259, 0.749, 0.631, 0.043, 0.451, 1.0, 0.529, 0.078, 0.714,];
var es_emerald_dragon_08 = [0.0, 0.38, 1.0, 0.004, 0.396, 0.184, 0.522, 0.004, 0.698, 0.051, 0.169, 0.004, 1.0, 0.008, 0.039, 0.004,];
var Colorfull = [0.0, 0.039, 0.333, 0.02, 0.098, 0.114, 0.427, 0.071, 0.235, 0.231, 0.541, 0.165, 0.365, 0.325, 0.388, 0.204, 0.416, 0.431, 0.259, 0.251, 0.427, 0.482, 0.192, 0.255, 0.443, 0.545, 0.137, 0.259, 0.455, 0.753, 0.459, 0.384, 0.486, 1.0, 1.0, 0.537, 0.659, 0.392, 0.706, 0.608, 1.0, 0.086, 0.475, 0.682,];
var Magenta_Evening = [0.0, 0.278, 0.106, 0.153, 0.122, 0.51, 0.043, 0.2, 0.247, 0.835, 0.008, 0.251, 0.275, 0.91, 0.004, 0.259, 0.298, 0.988, 0.004, 0.271, 0.424, 0.482, 0.008, 0.2, 1.0, 0.18, 0.035, 0.137,];
var Pink_Purple = [0.0, 0.075, 0.008, 0.153, 0.098, 0.102, 0.016, 0.176, 0.2, 0.129, 0.024, 0.204, 0.298, 0.267, 0.243, 0.49, 0.4, 0.463, 0.733, 0.941, 0.427, 0.639, 0.843, 0.969, 0.447, 0.851, 0.957, 1.0, 0.478, 0.624, 0.584, 0.867, 0.584, 0.443, 0.306, 0.737, 0.718, 0.502, 0.224, 0.608, 1.0, 0.573, 0.157, 0.482,]
var Sunset_Real = [0.0, 0.471, 0.0, 0.0, 0.086, 0.702, 0.086, 0.0, 0.2, 1.0, 0.408, 0.0, 0.333, 0.655, 0.086, 0.071, 0.529, 0.392, 0.0, 0.404, 0.776, 0.063, 0.0, 0.51, 1.0, 0.0, 0.0, 0.627,]
var es_autumn_19 = [0.0, 0.102, 0.004, 0.004, 0.2, 0.263, 0.016, 0.004, 0.329, 0.463, 0.055, 0.004, 0.408, 0.537, 0.596, 0.204, 0.439, 0.443, 0.255, 0.004, 0.478, 0.522, 0.584, 0.231, 0.486, 0.537, 0.596, 0.204, 0.529, 0.443, 0.255, 0.004, 0.557, 0.545, 0.604, 0.18, 0.639, 0.443, 0.051, 0.004, 0.8, 0.216, 0.012, 0.004, 0.976, 0.067, 0.004, 0.004, 1.0, 0.067, 0.004, 0.004,];
var BlacK_Blue_Magenta_White = [0.0, 0.0, 0.0, 0.0, 0.165, 0.0, 0.0, 0.176, 0.329, 0.0, 0.0, 1.0, 0.498, 0.165, 0.0, 1.0, 0.667, 1.0, 0.0, 1.0, 0.831, 1.0, 0.216, 1.0, 1.0, 1.0, 1.0, 1.0,];
var BlacK_Magenta_Red = [0.0, 0.0, 0.0, 0.0, 0.247, 0.165, 0.0, 0.176, 0.498, 1.0, 0.0, 1.0, 0.749, 1.0, 0.0, 0.176, 1.0, 1.0, 0.0, 0.0,];
var BlacK_Red_Magenta_Yellow = [0.0, 0.0, 0.0, 0.0, 0.165, 0.165, 0.0, 0.0, 0.329, 1.0, 0.0, 0.0, 0.498, 1.0, 0.0, 0.176, 0.667, 1.0, 0.0, 1.0, 0.831, 1.0, 0.216, 0.176, 1.0, 1.0, 1.0, 0.0,];
var Blue_Cyan_Yellow = [0.0, 0.0, 0.0, 1.0, 0.247, 0.0, 0.216, 1.0, 0.498, 0.0, 1.0, 1.0, 0.749, 0.165, 1.0, 0.176, 1.0, 1.0, 1.0, 0.0,];
var palettes = [ib_jul01, es_vintage_57, es_vintage_01, es_rivendell_15, rgi_15, retro2_16, Analogous_1, es_pinksplash_08, es_pinksplash_07, Coral_reef, es_ocean_breeze_068, es_ocean_breeze_036, departure, es_landscape_64, es_landscape_33, rainbowsherbet, gr65_hult, gr64_hult, GMT_drywet, ib15, Fuschia_7, es_emerald_dragon_08, lava, Colorfull, Magenta_Evening, Pink_Purple, Sunset_Real, es_autumn_19, BlacK_Blue_Magenta_White, BlacK_Magenta_Red, BlacK_Red_Magenta_Yellow, Blue_Cyan_Yellow,];
// palette vars end

// slider code start
export var zoom;
export var speed;
var rangeSlider = function(v, minValue, maxValue, isFloored, isReversed) {
  var valueRange = maxValue - minValue;
  var scaledValue = minValue + (v * valueRange);
  if (isReversed) {
    scaledValue = maxValue - (v * valueRange);
  }
  if (isFloored) {
    scaledValue = floor(scaledValue);
  }
  return scaledValue;
};
export function sliderZoom(v) { 
  zoom = 0.1 + v / 0.75;
}
export function sliderSpeed(v) { 
  speed = rangeSlider(v, 1, 5, false, true)
}
export function toggleDisableSliders(v) {
  if (v) {
    speed = 12.000000
    zoom = 0.3000000
  }
}
// slider code end

// palette code start
var PALETTE_HOLD_TIME = 3
var PALETTE_TRANSITION_TIME = 1;
export var currentIndex = 0;
var nextIndex = (currentIndex + 1) % palettes.length;
export function triggerIncrementPalette(){
  currentIndex = (currentIndex + 1) % palettes.length;
}
var pixel1 = array(3);
var pixel2 = array(3);
var PALETTE_SIZE = 16;
var currentPalette = array(4 * PALETTE_SIZE)
var inTransition = 0;
var blendValue = 0;
runTime = 0
setPalette(currentPalette);
buildBlendedPalette(palettes[currentIndex],palettes[nextIndex],blendValue)  
function paint2(v, rgbArray, pal) {
  var k,u,l;
  var rows = pal.length / 4;
  for (i = 0; i < rows;i++) {
    k = pal[i * 4];
    if (k >= v) break;
  }
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
function paletteMix(pal1, pal2, colorPct,palettePct) {
  paint2(colorPct,pixel1,pal1);
  paint2(colorPct,pixel2,pal2);  
  rgb(mix(pixel1[0],pixel2[0],palettePct),
      mix(pixel1[1],pixel2[1],palettePct),
      mix(pixel1[2],pixel2[2],palettePct)
   )
}
function buildBlendedPalette(pal1, pal2, blend) {
  var entry = 0;
  for (var i = 0; i < PALETTE_SIZE;i++) {
    var v = i / PALETTE_SIZE;
    paint2(v,pixel1,pal1);
    paint2(v,pixel2,pal2);  
    currentPalette[entry++] = v;
    currentPalette[entry++] = mix(pixel1[0],pixel2[0],blend)
    currentPalette[entry++] = mix(pixel1[1],pixel2[1],blend)
    currentPalette[entry++] = mix(pixel1[2],pixel2[2],blend)    
  }
}
// palette code end

// render code start
export function beforeRender(delta) {
  runTime = (runTime + delta / 1000) % 3600;
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
    } else {
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
  tf = speed // Overall animation duration constant. A smaller duration runs faster.
  f  = wave(time(tf * 6.6 / 65.536)) * 5 + 2 // 2 to 7; Frequency (cell density)
  t1 = wave(time(tf * 9.8 / 65.536)) * PI2  // 0 to 2*PI; Oscillates x shift
  t2 = wave(time(tf * 12.5 / 65.536)) * PI2 // 0 to 2*PI; Oscillates y shift
  t3 = wave(time(tf * 9.8 / 65.536)) // Shift h: wavelength of tf * 9.8 s
  t4 = time(tf * 0.66 / 65.536) // Shift v: 0 to 1 every 0.66 sec
}
export function render2D(index, x, y) {
  x /= zoom
  y /= zoom
  z = (1 + sin(x * f + t1) + cos(y * f + t2)) * .5 

  v = wave(z + t4)
  v = v * v * v
  h = triangle(z) / 2 + t3
  paint(h,v)
}
export function render(index) {
  pct = index / pixelCount 
  render2D(index, 3 * pct, 0)
}
export function render3D(index, x, y, z) {
  x1 = (x - cos(z / 4 * PI2)) / 2
  y1 = (y - sin(z / 4 * PI2)) / 2
  render2D(index, x1, y1)
}
// render code end
