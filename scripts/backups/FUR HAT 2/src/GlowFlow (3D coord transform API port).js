/*
This pattern is a port of GlowFlow by Roger - updated to use
the coordinate transformation API. 
https://hackaday.io/project/166871-glow-flow
https://newscrewdriver.com/tag/glow-flow/
https://github.com/Roger-random/glowflow

---------------------------------

Glow Flow

A Pixelblaze pattern to illuminate half of a 3D mapped volume based on value of
accelerometer on the Pixelblaze sensor expansion board. Renders illusion of a
half-full container of glowing fluid that flows to the bottom. Built on top of
"Accelerometer Tilt 3D" with sound-reactive elements copied from existing
Pixelblaze sample pattern "blinkfade". The intent is to make the colorful
'liquid' look like it is fizzing and popping in reaction to sound.

Requires:
* Pixelblaze with sensor expansion board
* Pixel Mapper filled in with 3D (X,Y,Z) coordinates of LED pixels

Roger Cheng 2019
https://newscrewdriver.com
Github: Roger-random / Twitter: @Regorlas

Ben Hencke 2021
* Updated for transformation API
* A simple IIR averaging filter is used to smooth out 
  accelerometer samples.
* Added some flags for controling which sensors are used
* Optional rotation for PB cube stand

*/

export var energyAverage
export var accelerometer
export var light

//larger filterFactor values are smoother but slower to respond
var filterFactor = .7
var rotateForPBCube = false
var useSound = true
var useLight = false

// PI Controller to dynamically adjust microphone sensitivity based on ambient level
var targetFill = 0.01
var pic = makePIController(.05, .15, 1000, 0, 1000)


// Polar angle is how far the vector is tilted, relative to +Z axis. (On a globe, it is latitude.)
// 0 = vector is pointing up, aligned with +Z
// PI = vector is pointing down, aligned with -Z
function polarAngle(x,y,z) {
  polar = 0

  if (z == 0) {
    // Z = 0 means vector is somewhere on XY plane.
    // Hard code answer is faster and avoids divide by zero.
    polar = PI/2
  } else if (z > 0) {
    // +Z = between 0 and PI/2
    polar = atan(sqrt(pow(x,2)+pow(y,2))/z)
  } else {
    // -Z = between PI/2 and PI
    polar = PI-atan(sqrt(pow(x,2)+pow(y,2))/-z)
  }

  return polar
}

// Azimuth is direction of polar angle projected on XY plane. (On a globe, it is longitude.)
// 0 = vector is aligned with +X
// PI/2 = vector is aligned with +Y
// -PI/2 = vector is aligned with -Y
function azimuthAngle(x,y) {
  azimuth = 0

  if (x == 0) {
    // X of zero means vector is aligned with Y axis one way or another.
    // Hard code answer is faster and avoids divide by zero
    if (y >= 0) {
      // Aligned with +Y axis
      azimuth = PI/2
    } else {
      // Aligned with -Y axis
      azimuth = -PI/2
    }
  } else if (x > 0) {
    // +X = somewhere between -PI/2 and PI/2
    azimuth = atan(y/x)
  } else {
    // -X = somewhere between PI and PI/2 for +Y, between -PI and -PI/2 for -Y
    azimuth = PI-atan(y/-x)
  }

  return azimuth
}


function makePIController(kp, ki, start, min, max) {
  var pic = array(5)
  pic[0] = kp
  pic[1] = ki
  pic[2] = start
  pic[3] = min
  pic[4] = max
  return pic
}

function calcPIController(pic, err) {
  pic[2] = clamp(pic[2] + err, pic[3], pic[4])
  return max(pic[0] * err + pic[1] * pic[2],.3)
}


// Values controlled via PI Controller
var vals = array(pixelCount)
var sensitivity

// Feedback given to PI Controller for adaptation
var brightnessFeedback = 0

// HSV value multiplier adjusted based on light sensor
export var lightAdj

export var aa, pa //azimuth angle and polar angle for the animation frame
export var x, y, z, gForce

export function beforeRender(delta) {
  t2 = time(.01)
  
  //apply an averaging filter to the accelerometer readings
  //also, for my build I'm swapping around the x and y axis
  //and swapping which way is up or forward by negating the 
  //accelerometer sample
  x = (x * filterFactor) + (accelerometer[1] * (1-filterFactor))
  y = (y * filterFactor) + (-accelerometer[0] * (1-filterFactor))
  z = (z * filterFactor) + (-accelerometer[2] * (1-filterFactor))
  
  aa = azimuthAngle(x, z) - PI/2
  pa = polarAngle(x, z, y) - PI/2

  //accelerometer samples are right about 1/50th of a G
  gForce = hypot3(x, y, z) * 50 
  
  resetTransform()
  translate3D(-.5, -.5, -.5)
  
  //re-orient the cube to stand on it's corner
  if (rotateForPBCube) {
    rotateZ(PI*.25)
    rotateX(PI*.3)
  }
  
  //apply rotations based on accelerometer
  rotateY(aa)
  rotateX(-pa)
  
  if (useSound) {
    // Update PI Controller & associated values
    sensitivity = calcPIController(pic, targetFill - brightnessFeedback / pixelCount);
    brightnessFeedback = 0
    for (i = 0; i < pixelCount; i++) {
      vals[i] -= .001 * delta + abs(energyAverage * sensitivity / 5000)
      if (vals[i] <= 0) {
        vals[i] = energyAverage * sensitivity * random(1)
      }
    }
  }
  
  // Calculate lighting adjustment factor
  if (useLight)
    lightAdj = clamp(light,0.01,1.0) // Adjust 1.0 downwards if power supply can't handle full power
  else
    lightAdj = 1  

}


export function render3D(index, x, y, z) {
  var hue, saturation, value, micV
  
  if (useSound) {
    // Microphone controlled value for this pixel
    micV = vals[index]*3
    micV = micV * micV
    brightnessFeedback += clamp(micV,0,1)
  } else {
    micV = 0
  }

  // Rendering based on Z axis in transformed space
  hue = 1
  saturation = 1 - clamp(micV,0,0.1)
  value = 1

  if (z < 0) {
    // Colorful multilayered liquid in the bottom of container
    hue = clamp(-z,0,0.95)
  } else {
    // Orange fades to black as we get further above surface of liquid
    hue = 0.01
    value = 1-z
    value = value*value*value //sharpen the horizon fade a bit
  }

  // Adjust for ambient lighting level
  value = value * lightAdj

  hsv(hue, saturation, value)
  
}
