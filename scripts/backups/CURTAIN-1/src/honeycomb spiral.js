var timebase = 0;

export var speed = 0.04;
export var numArms = 2;
export var direction = 1;
export var zoom = 10;  // Added zoom variable

// Slider for controlling the speed
export function sliderSpeed(v) {
  speed = 0.01 + 8*v;
}

// Slider for controlling the number of arms
export function sliderArms(v) {
  numArms = round(v * 30);  // up to 25 arms
}

// Slider for controlling the direction
export function sliderDirection(v) {
  direction = v > 0.5 ? 1 : -1;
}

// Slider for controlling the zoom level
export function sliderZoom(v) {
  zoom = 0.1 + v*10;  // Adjust range as needed, currently 0.1 to 10.1
}

// Pre-calculate some common numbers
export function beforeRender(delta) {
  timebase += delta / 1000 * speed * direction;
  while (timebase < 0) timebase += PI2;
  while (timebase >= PI2) timebase -= PI2;
  
  tf = 5; // Overall animation duration constant. A smaller duration runs faster.
  t1 = wave(time(tf * 9.8 / 65.536)); // Shift h: wavelength of tf * 9.8 s
  t4 = time(tf * 0.66 / 65.536); // Shift v: 0 to 1 every 0.66 sec
}

export function render2D(index, x, y) {
  // Calculate the polar coordinates of the LED relative to the center
  var dx = (x - 0.5) * zoom;  // Adjusted for zoom
  var dy = (y - 0.5) * zoom;  // Adjusted for zoom
  var radius = sqrt(dx * dx + dy * dy);
  var angle = atan2(dy, dx);
  
  // Calculate the color based on the radius and angle
  var color = ((angle + numArms * radius + timebase) % PI2) / PI2;
  
  // Use the color to set the LED
  if (color >= 0.2 && color <= 0.99) {
    hsv(0, 0, 0);  // make the honeycomb portion non-visible
  } else {
    // Set the visible part to use the honeycomb colors
    var z = (1 + sin(x * 5 + t1) + cos(y * 5 + t1)) * .5;
    var v = wave(z + t4);
    v = v * v * v;  // brightness scaling
    var h = triangle(z) / 2 + t1;
    hsv(h, 1, v);  // Show colors with varying brightness
  }
}
