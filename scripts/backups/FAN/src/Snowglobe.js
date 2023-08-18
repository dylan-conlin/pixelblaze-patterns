// Snowglobe is a deriviative of the default Sparks pattern
var numSparks = 30
var friction = 1 / pixelCount
var sparks = array(numSparks)
var sparkX = array(numSparks)
var pixels = array(pixelCount)

export var speed = .03 // Tune for your physical install's rotation
export function sliderSpeed(v) {
  speed = .3 + (v * 10)
}

function beforeSnowglobe(delta) {
  delta *= .01 * speed
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

export var mode, modeTime

export function beforeRender(delta) {
  beforeSnowglobe(delta)
}

export function render3D(index, r, phi, theta) {
  snowglobe(index, r, phi, theta)
}
  
export function render2D(index, r, phi) {
  render3D(index, r, phi, .5) // Equatorial section
}

export function render(index) {
  render2D(index, index / pixelCount, 0)
}
