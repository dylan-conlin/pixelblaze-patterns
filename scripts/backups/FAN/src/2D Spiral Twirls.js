/**
 * A configurable 2D pattern that creates a variety of
 * rotating and swirling circular and spiral effects.
 * For best results a matrix of 16x16 or greater is recommended.
 * 
 * I'd suggest starting with all the sliders at zero, then trying
 * each of them one at a time to see what impact it has on the
 * resultant pattern. That way it should be easier to understand
 * how to combine them all to get the effect you'd like.
 * 
 * Pattern by @ChrisNZ
 */
var twistSpeed = 0.015
var rotateSpeed = 0.002
var startingColor = 0.3
var colorSpeed = 0.015
var twist
var rotation
var colorShift
var arms


// How quickly the spiral should rotate back and forth
export function sliderTwistSpeed(v) { twistSpeed = v = 0 ? 0 : 0.015 / v }

// How quickly the entire pattern should rotate
export function sliderRotationSpeed(v) { rotateSpeed = v = 0 ? 0 : 0.005 / v }

// What initial colors to display. If colorSpeed is zero then the pattern will
// stay this color
export function sliderInitialColor(v) { startingColor = v * 2 }

// How quickly the colors of the pattern should change
export function sliderColorSpeed(v) { colorSpeed = v = 0 ? 0 : 0.015 / v }

// How many arms of symmetry the pattern should have
export function sliderArms(v) { arms = v * 2 + 1; arms = arms - (arms - floor(arms)) }

export function beforeRender(delta) {
  twist = wave(time(twistSpeed)) * 2 - 1
  rotation = time(rotateSpeed)
  colorShift = time(colorSpeed)
}

export function render2D(index, x, y) {
  xNorm = (x - 0.5) * 2
  yNorm = (y - 0.5) * 2
  dist = sqrt(xNorm * xNorm + yNorm * yNorm)
  angle = (arctan2(yNorm, xNorm) + PI) / PI / 2
  t = twist < 0 ? dist * twist : dist * twist
  angle += t / 2
  
  setColor(angle, rotation, dist)
}

function setColor(angle, rotation, dist) {
  h = angle * arms - rotation + 10
  h = h - floor(h)
  s = 1
  v = (1.01 - dist) * (h < 0.5 ? h * h * h : h)
  hsv((h + startingColor) / 2 + colorShift, s, v)
}

// Temporary fix/workaround until the built in atan2() is fixed
function arctan2(y, x) {
  if (x > 0) return atan(y/x)
  if (y > 0) return PI / 2 - atan(x/y)
  if (y < 0) return -PI / 2 - atan(x/y)
  if (x < 0) return PI + atan(y/x)
  return 1.0
}