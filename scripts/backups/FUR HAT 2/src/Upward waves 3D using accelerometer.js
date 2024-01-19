/*
This pattern is largely inspired (and borrows from) GlowFlow:
https://hackaday.io/project/166871-glow-flow
https://newscrewdriver.com/tag/glow-flow/
https://github.com/Roger-random/glowflow

The accelerometer is used to determine which way is "up" and
corresponding coordinate transformations are applied to keep
the animation oriented.

A simple IIR averaging filter is used to smooth out 
accelerometer samples.

Additionally, the coordinates can be rotated to put a mapped 
cube on it's corner to match the build of the Pixelblaze cube
stand.

10/8/2021 - Ben Hencke

*/

export var accelerometer

//larger filterFactor values are smoother but slower to respond
var filterFactor = .7 
var rotateForPBCube = false


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


export var aa, pa //azimuth angle and polar angle for the animation frame
export var x, y, z, gForce

export function beforeRender(delta) {
  t2 = time(2.1)
  
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
}


export function render3D(index, x, y, z) {
  //base the color on the distance from center
  h = hypot(x,y) * 1.5 + .5
  //make bands of light travel upwards along the z axis by shifting a 
  //triangle waveform down, then multipling it so that the
  //positive peak reaches 1, then scale by g forces.
  v = (triangle(z - t2) - .5) * 2 * gForce
  v = max(v, 0) //clip negative to zero
  v = v*v*v*v  //sharpen the band a bit
  hsv(h, 1, v)
}

/*
This pattern is largely inspired (and borrows from) GlowFlow:
https://hackaday.io/project/166871-glow-flow
https://newscrewdriver.com/tag/glow-flow/
https://github.com/Roger-random/glowflow

The accelerometer is used to determine which way is "up" and
corresponding coordinate transformations are applied to keep
the animation oriented.

A simple IIR averaging filter is used to smooth out 
accelerometer samples.

Additionally, the coordinates can be rotated to put a mapped 
cube on it's corner to match the build of the Pixelblaze cube
stand.

10/8/2021 - Ben Hencke

*/

export var accelerometer

//larger filterFactor values are smoother but slower to respond
var filterFactor = .99
var rotateForPBCube = false


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


export var aa, pa //azimuth angle and polar angle for the animation frame
export var x, y, z, gForce

export function beforeRender(delta) {
  t2 = time(10)
  
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
}


export function render3D(index, x, y, z) {
  //base the color on the distance from center
  h = hypot(x,y) * 1.5 + .5
  //make bands of light travel upwards along the z axis by shifting a 
  //triangle waveform down, then multipling it so that the
  //positive peak reaches 1, then scale by g forces.
  v = (triangle(z - t2) - .5) * 2 * gForce
  v = max(v, 0) //clip negative to zero
  v = v*v*v*v  //sharpen the band a bit
  hsv(h, 1, v)
}
