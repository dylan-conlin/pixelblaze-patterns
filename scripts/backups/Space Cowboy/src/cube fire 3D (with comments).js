// Set animation speed (1 means normal speed)
speed = 1

// Calculate time values and scale before each render cycle
export function beforeRender(delta) {
  t1 = time(.1/speed) // Calculate the time value for hue (based on speed)
  t2 = time(.13/speed) // Calculate the time value for value falloff along the Y-axis (based on speed)
  t3 = time(.085/speed) // Calculate the time value for value falloff along the X-axis (based on speed)
  scale = (.5 + wave(time(.1)))/2 // Calculate a scale factor based on the wave function
}

// Main render function that calls render3D() with 3D coordinates
export function render(index) {
 // Calculate X-coordinate as index/pixelCount (Y and Z always 0 in 1D)
  render3D(index, index/pixelCount, 0, 0)
}

// 2D render function that adds a z-value of 0 and calls render3D()
export function render2D(index, x, y) {
  render3D(index, x, y, 0) // Add a Z-coordinate of 0 to the 2D coordinates and call render3D
}
// 3D render function that generates the LED pattern using HSV color model
export function render3D(index, x, y, z) {
  // Calculate hue (h) by combining the time value (t1) with contributions from
  // x, y, and z coordinates
  h = t1 + x * 0.2 + y * 0.2 + z * 0.2

  // Initialize saturation (s) to 1, which means fully saturated colors (0 would
  // mean grayscale)
  s = 1

  // Calculate value (v) by multiplying wave functions based on the time values
  // and coordinates and scaling the result by 10 to control brightness
  v = (wave(z * scale + wave(t1)) * wave(y * scale + wave(t2)) * wave(x * scale + wave(t3))) * 10

  // Update saturation (s) by subtracting 1 from the calculated value (v) to
  // make darker colors less saturated
  s = v - 1

  // Apply power of 3 to value (v) for a smooth falloff in brightness as the
  // value decreases
  v = v * v * v

  // Set the HSV color for the current LED using the calculated hue (h),
  // saturation (s), and value (v)
  hsv(h, s, v)
}
