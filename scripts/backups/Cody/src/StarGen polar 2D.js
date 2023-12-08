/*
  StarGen: A generic star generator for polar-mapped 2D displays.
  
  Demo video: https://youtu.be/ehWF5ZE1VVA
  $30 241 LED circular display: https://www.amazon.com/gp/product/B083VWVP3J
  Map: https://gist.github.com/jvyduna/7a14e7449c63363e01ebbf26fcfba685
    (hat tip to Scruffynerf for the cartesian)
  
  Polar maps are assumed to be stored as 0..1 in each of [r, phi, theta]
  
  I've used the physics convention as shown in:
    https://en.wikipedia.org/wiki/Spherical_coordinate_system
  
    r: distance from origin
    phi: rotation about z axis
    theta: azimuth angle from the +z axis

  Remember that in Pixelblaze, the final extents for each dimension are scaled to
  0..1, so a phi of 0.5 is like PI in radians; theta of 0.5 is on the XY plane.
  
  Crossfades with "shimmer" effect between modes.
  
  Jeff Vyduna, 2020 / MIT License
*/

var modeOverride = 0       // If >0, manually force disply of a selected mode
export function sliderModeOverride(v) {
  modeOverride = floor(v * modeCount)
  mode = modeOverride - 1
}

var secPerMode = 20        // Default for the seconds spent in each mode
xFadePct = 4 / secPerMode  // Percentage of the time spent in crossfades
export function sliderMinutesPerMode(v) {
  secPerMode = v * 60
  xFadePct = 4 / secPerMode
}

export var offsetAngle = 0 // Tune for your physical install's rotation
export function sliderOffsetAngle(v) { offsetAngle = v }

// export var p1 // Parameter sometimes used for testing/tuning
// export function sliderParam1(v) { p1 = v }

var modeCount = 12         // Total number of modes we're cycling through
var beforeRenders = array(modeCount)
// init all beforeRenderers to empty anonymous functions
for (i = 0; i < modeCount; i++) beforeRenders[i] = function(d) {}
// These are the animation modes it will cycle through
renderers = array(modeCount)

beforeRenders[0] = beforeOvals
renderers[0] = ovals
beforeRenders[1] = beforeSinustar6
renderers[1] = sinustar6
beforeRenders[2] = beforeSinushimmer
renderers[2] = sinushimmer
beforeRenders[3] = beforeDavid
renderers[3] = david
beforeRenders[4] = beforeBethlehem
renderers[4] = bethlehem
beforeRenders[5] = beforePentagram
renderers[5] = pentagram
beforeRenders[6] = beforeDecagram
renderers[6] = decagram
beforeRenders[7] = beforeHexagram
renderers[7] = hexagram
renderers[8] = heart
beforeRenders[9] = beforeBirdflap
renderers[9] = birdflap
beforeRenders[10] = beforeRainbowSpirals
renderers[10] = rainbowSpirals
beforeRenders[11] = beforeSnowglobe
renderers[11] = snowglobe

export var mode, modeTime
export function beforeRender(delta) {
  tMode = time(secPerMode * modeCount / 65.536) // 0..1 through entire playlist
  if (modeOverride == 0) mode = floor(modeCount * tMode)
  
  // Compute this beforeRenderer and sometimes, the next
  beforeRenders[mode](delta)
  
  // Decimal progress through all modes, 0..modeCount
  modeTime = time(secPerMode * modeCount / 65.536) * modeCount
 
  // 0 when not crossfading; 0..0.999 when crossfading
  pctIntoXfFade = max(((modeTime % 1) - (1 - xFadePct)) / xFadePct, 0)
  // We'll need the next mode's beforeRender if crossfading into it
  if (pctIntoXfFade > 0) beforeRenders[(mode + 1) % modeCount](delta)
}


export function render3D(index, r, phi, theta) {
  /* 
    If we're crossfading mode 1 to mode 2, we randomly pick that this pixel will
    come from either mode 1's renderer or mode 2's. Which one it comes from 
    is probabilistically related to the percentage we're into this crossfade.
  */
  skew = random(1) < wave((pctIntoXfFade - 0.5) / 2) // wave makes it "tween"

  // modeOverride == 0 means run the playlist
  if (modeOverride == 0) mode = floor((modeTime + skew) % modeCount)
  
  // Note that using `- offsetAngle` instead is viable but watch for sign issues, 
  // like assumptions around abs(phi) or phi^3.
  renderers[mode](index, r, phi + offsetAngle, theta)
}
  
export function render2D(index, r, phi) {
  render3D(index, r, phi, .5) // Equatorial section
}

export function render(index) {
  render2D(index, index / pixelCount, 0)
}



// Renderers

// Somewhat of a celestial orbit path / star
var ovalHue, o3, o4_6_10, o8, o15, t6
function beforeOvals(delta) {
  o8 = osc(8)
  ovalHue = 0.07 + ((o8 > .96) ? 1 - o8 : 0)
  o3 = osc(3); o15 = osc(15)
  o4_6_10 = osc(4) * osc(6) * osc(10)
  t6 = time(6 / 65.536)
}
function ovals(index, r, phi, theta) {
  var p = (phi - t6 * o15) * PI2
  p += r * o4_6_10  // Adds occasional galaxy skew
  var a = 1 + 2 * o3
  var b = 1 + 2 * o8 + 2 - a
  
  line = near(4 * r,
    a * b / sqrt(pow(b * cos(p), 2) + pow(a * sin(p), 2))
  , 1)
  hsv(ovalHue, .85 - .08 * (1 - abs(a - b)), line)
  
  if (r == 0) hsv(o8, 1, .5) // Colorful center pixel
}


// At times, it's snowflake-esque
var t3
function beforeSinustar6(delta) {
  t3 = time(3 / 65.536)
}
function sinustar6(index, r, phi, theta) {
  line = near(r,
    2 * osc(10) + .4 * cos((6 * phi - t3) * PI2)
  , .4)
  hsv(0, 0, line)
}

// Note sure what's going on here. Snow? Digital Bob Ross
// is pleased with this happy little accident.
var t3
function beforeSinushimmer(delta) {
  t3 = time(3 / 65.536)
}
function sinushimmer(index, r, phi, theta) {
  line = near(r, 
    0.94 + .4 * cos((6 * phi * 6 - t3) * PI2)
  , .4)
  hsv(0, 0, line)
}


// Kaleidoscopic abstract star of David, sometimes, for a moment
var o21, o23, dSides
function beforeDavid(delta) {
  o21 = osc(21)
  o23 = osc(23) 
  dSides = 6
}
function david(index, r, phi, theta) {
  slice = floor(phi * dSides * 2)
  parity = slice % 2
  line = near(r, 
    o23 / cos(PI2 * (phi + o21 - parity / dSides - slice / dSides / 2))
  )
  hsv(0, 0, line)
}


// Star over Bethlehem
var o40, o50
function beforeBethlehem(delta) {
  o4 = osc(4)
  o5 = osc(5)
}
function bethlehem(index, r, phi, theta) {
  line = wrappedNear(phi * 8 % 1, 1, 1.1 - pow(r, 2 * o5))
  // Oranger near the outside
  var h = 0.05 + (1 - r) / 8
  var s = sqrt(sqrt(r))
  // Makes the 45deg rays fade in and out
  var v = line - o4 * triangle(4 * (phi - PI2 / 8))
  hsv(h, s, v)
}


// Pentagram: https://www.desmos.com/calculator/uessc1gnli
var o50, wander
function beforePentagram(delta) {
  o50 = osc(50)
  var lfo = 80 * triangle(time(600 / 65.536)) - 20
  // Scale: https://www.desmos.com/calculator/qgt5bvbv0d
  pentaParam1 = pow(1.6 * sin(lfo) / lfo + 1.532, 3) - 1
  
  // Random bounded wandering value
  wander = clamp(wander + 0.001 * (random(2) - 1), -.4, .4)
  // Used for thickness of the "line" that's plotted
  pentaParam2 = 3.6 / 30 * pentaParam1 + .4 + wander
}
function pentagram(index, r, phi, theta) {
  line = near(r * pentaParam1, 
    //          sides        sides      rotation  
    1 / cos(2 / 5 * acos(cos(5 * (phi - o50) * PI2)))
  , pentaParam2)
  hsv(0, 0, line)
}


var o400
function beforeDecagram(delta) {
  o400 = osc(400) // Very slow rotation
}
function decagram(index, r, phi, theta) {
  line = near(r * 3.5,
    //      2/sides       sides*2     rotation
    1 / cos(.4 * acos(cos(10 * (phi - o400) * PI2)))
  , 1.5)
  hsv(0, 0, line + (r < .3)) // Filled center
}


var o40
function beforeHexagram(delta) {
  o40 = osc(40)
}
function hexagram(index, r, phi, theta) {
  var sides = 6
  line = near(r * 2.5,
    1 / cos(2 / sides * acos(cos(sides * (phi - o40) * PI2)))
  , .45)
  hsv(0, 0, line)
}


function heart(index, r, phi, theta) {
  var s = osc(20)
  var p = (phi - .5) * PI2
  line = near(4 * s * r,
    2 - 2 * sin(p) + sin(p) * sqrt(abs(cos(p))) / (sin(p) + 1.4)
  , .6)
  hsv(0, 1.5 * sqrt(s), line)
}


// A birdlike thing
var wingbend, breath, flap
function beforeBirdflap(delta) {
  wingbend = .175 + osc(2.5) * .35
  breath = .2 + .9 * osc(4)
  flap = -.19 +           // Wings' dihedral angle
          .14 * abs(cos(PI2 * time(5 / 65.536))) // Wingsroke animation
}
function birdflap(index, r, phi, theta) {
  line = near(r, 
    // bend               createsV  rotation
    wingbend / cos(PI2 * (abs(phi - 1.253 ) + flap) )
  , .9 * r)
  hsv(0.04, 0.95, breath * line)
}


var lfo10, lfo8, lfo6
function beforeRainbowSpirals(delta) {
  slowness = 9
  lfo10 = 3 * osc(5 * slowness)
  lfo8 = .5 + osc(4 * slowness)
  lfo6 = .1 + osc(3 * slowness)
}
function rainbowSpirals(index, r, phi, theta) {
  var line = 0
  line = near(2 * (r * lfo10 % lfo8), lfo6 * phi)

  hsv(fixH(r + phi), 1, line)
}


// Snowglobe is a deriviative of the default Sparks pattern
var numSparks = 20
var friction = 1 / pixelCount / 2
var sparks = array(numSparks)
var sparkX = array(numSparks)
var pixels = array(pixelCount)

function beforeSnowglobe(delta) {
  delta *= .1
  for (i = 0; i < pixelCount; i++) pixels[i] = 0
  for (i = 0; i < numSparks; i++) {
    if (abs(sparks[i]) <= .001) {
      sparks[i] = .1 + random(.4)
      sparkX[i] = random(pixelCount)
      if (random(1) > .5) sparks[i] *= -1
    }
    sparks[i] -= friction * delta * (sparks[i] > 0 ? 1 : -1)
    sparkX[i] += sparks[i] * delta
    if (sparkX[i] > pixelCount || sparkX[i] < 0) {
      sparkX[i] = 0; sparks[i] = 0
    }
    pixels[sparkX[i]] += abs(sparks[i])
  }
}
function snowglobe(index) {
  var v = pixels[index]
  hsv(.63, 1 - v, v * v)
}


// Utilities

// Helper to quickly define 0-1 oscillators of a defined period. Becomes
// ineffecient unless only used in beforeRenders.
function osc(sec) { return wave(time(sec / 65.536)) }

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

/*
  Assuming a & b are given as angles, where a=0 corresponds to 0 radians,
  a=0.25 corresponds to Pi/2 radians, and a=1 wraps back to 0 radians...
  Returns 1 when a & b are proximate as angles on a circle, 0 when they
  are more than `width/2` apart, and a gamma-corrected brightness for
  distances within `width/2`
*/
function wrappedNear(a, b, halfwidth) {
  if (halfwidth == 0) halfwidth = halfwidthDefault
  var v = clamp(1 - triangle(a - b) / halfwidth / 2, 0, 1)
  return v * v
}

// Perceptual hue conversion - Improves HSV to  a more human perception 
// of a balanced rainbow
function fixH(pH) {
  pH = pH % 1 + (pH < 1)  // Wrap inputs
  return wave((pH-0.5)/2)
}
