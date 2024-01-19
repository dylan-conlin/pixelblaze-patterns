/**
 * This pattern works with either a strip or rectangular matrix, and ideally with the sensor
 * expansion board. It works fine on both PBv2 and PBv3. It simulates a row of bouncing balls
 * that can be triggered by shaking the accelerometer.
 *
 * You will need to set the 'width' variable to the width of your matrix, or set it to 1 if
 * you are just using an LED strip.
 * 
 * If you do not have the sensor expansion board, uncomment the "init(i)" at line 130. This
 * will cause the balls to "rebounce" automatically once they have come to rest, rather than
 * relying on the accelerometer.
 * 
 * There are multiple parameters that can be configured using the slider controls:
 *   Gravity - how strong the force of gravity is on the balls.
 *   Motion Sensitivity - how much sudden movement is required for the balls to 'rebounce'.
 *   Show Rainbow - enables/disables a rainbow pattern underneath the balls.
 *   Randomness - how closely the balls stay in sync with each other.
 *
 * Pattern by @ChrisNZ, inspired by inspired by this project https://hackaday.io/project/177255-neopixel-led-skirt
 */

// Set this to the width of your matrix
var width = 8
var height = pixelCount / width


// Acceleration of gravity in m/s^2
export var gravity = -9.81
export function sliderGravity(v) {
  gravity = -v * 29 - 1
  resetAll()
}

// How sensitive the pattern is to movement from the accelerometer
export var motionThreshold = 0.03
export function sliderMotionSensitivity(v) {
  motionThreshold = v * v * 0.07055 + 0.0195
}

// Whether or not to draw a rainbow pattern under the bouncing balls
export var rainbow = 1
export function sliderShowRainbow(v) {
  rainbow = v >= 0.5
}


export var randomness = 100
export function sliderRandomness(v) {
  randomness = v * v * 500
}

function initGravity() {
  impactVelocityStart = sqrt(-2 * gravity * startHeight)
}

// Get accelerometer info from the sensor expansion board - 3 element array with [x,y,z]
export var accelerometer

var debounce = 0
var prevAccel = array(3)
var diff = array(3)

var dampening = 0.95   // How much dampening to apply to each ball after it bounces
var startHeight = 0.6   // Starting height of the ball, in meters
var impactVelocityStart

// Keep track of multiple balls, one per vertical strip
var ballHeight = array(width)            // Current height of each ball.
var impactVelocity = array(width)        // The current impact velocity of each ball. This decreases with each bounce.
var timeSinceLastBounce = array(width)   // How long since the last bounce. This helps calcuate the new height.
var startDelay = array(width)            // How long a delay before each ball starts bouncing. The 'Randomness' slider
                                         // affects this.


function resetAll() {
  initGravity()
  for (i = 0; i < width; i++) {
    init(i)
  }
}

// Reset a ball so it starts bouncing again
function init(i) {
  ballHeight[i] = 0
  impactVelocity[i] = impactVelocityStart
  timeSinceLastBounce[i] = 0
  startDelay[i] = random(randomness)
}


resetAll()

export function beforeRender(delta) {
  xa = accelerometer[0]
  ya = accelerometer[1]
  za = accelerometer[2]
  diff[0] = abs(xa - prevAccel[0])
  diff[1] = abs(ya - prevAccel[1])
  diff[2] = abs(za - prevAccel[2])
  totalAccel = sqrt(xa * xa + ya * ya + za * za)
  
  debounce = clamp(debounce + delta, 0, 2000) // Prevent overflow
  
  // Bounce all the balls if sensor board is shaken, no more than every second
  if (debounce > 1000 && totalAccel > motionThreshold) {
    debounce = 0
    resetAll()
  }
  
  for (i = 0; i < width; i++) {
    // If this ball's startDelay hasn't expired, don't do anything yet
    if (startDelay[i] > 0) {
      startDelay[i] -= delta
      continue
    }
  
    timeSinceLastBounce[i] += delta
    time = timeSinceLastBounce[i] / 1000
    ballHeight[i] = 0.5 * gravity * time * time + impactVelocity[i] * time
    
    // Check if the ball has reached the bottom of the strip. If so, bounce it
    if (ballHeight[i] < 0) {
      ballHeight[i] = 0
      impactVelocity[i] *= dampening
      timeSinceLastBounce[i] = 0
      
      
      // If the ball has (nearly) stopped moving, we can kick it back up to full bounce.
      // This is useful if you don't have an accelerometer.
      if (impactVelocity[i] < 1) {
        // init(i)
      }
    }
  }
}

export function render2D(index, x, y) {
  xPixel = floor(x * width)
  yPixel = height - 1 - floor(y * height)
  
  yBall = floor(ballHeight[xPixel] * height)
  
  if (yPixel == yBall) {
    rgb(1, 1, 1)
  } else if (rainbow && yPixel < yBall) {
    hsv((yBall - yPixel) / height + wave(x), 1, 1) 
  }
}