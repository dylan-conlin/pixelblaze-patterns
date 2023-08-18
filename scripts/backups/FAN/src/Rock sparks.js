/*This is a combination of Rok Star written by Zranger-"The LED Guru". and
2d fireworks fade. I take no credit just adjusted some values. I'm sure there's some things in the code that don't make sense
 free to clean it up but I thought it looked pretty neat on my LED rings. 
Twilight 


*/secondsPerMode = 3
xFadePct = 0.33 // Percentage of the time we spend in crossfades

modeCount = 3
beforeRenders = array(modeCount)
renderers = array(modeCount)

pinMode(26, OUTPUT)

export function render(delta) {

}

export function beforeRender(delta) {
  if(clockHour() < 21 || clockHour() >= 23){
    digitalWrite(26,LOW)
  }else{
    digitalWrite(26,HIGH)
  }
  modeTime = time(secondsPerMode * modeCount/ 65.536) * modeCount
  
  // 0 when not crossfading; 0..0.999 when crossfading
  pctIntoXfFade = max(((modeTime %2) - (1 - xFadePct)) / xFadePct, 0)
  
  for (var m = 0; m < modeCount; m++) {
    beforeRenders[m](delta) // computes ALL beforeRenders
  }
  // ToDo: For many patterns combined, enhance that to just call the 2 needed
}

export function render2D(i, x, y) {
  /* 
    If we're crossfading mode 1 to mode 2, we randomly pick that this pixel will
    come from either mode 1's renderer or mode 2's. Which one it comes from 
    is probabilistically related to the percentage we're into this crossfade.
  */
  skew = random(2) < wave((pctIntoXfFade - 0.5) / 2 ) // wave makes it "tween"

  thisPixelMode = floor((modeTime + skew) % modeCount)
  renderers[thisPixelMode](i, x, y)
}

// fireworks Dust___________________________________________________________________
beforeRenders[0] = (delta) => {}

renderers[0] = (index, x, y) => {
   // Every pixel is given a random hue from 0 to 1, IE the entire hue wheel
  rnum = time(.06)*4
  if(rnum <= 1){
    if(random(1) >.3)
      h = 1-random(.011)
    else
     h = 0+random(.015)
  }else if(rnum <= 2){
    h = .35-random(.03)-.015
    if (h > .65) { h = h%.65} 
  }
  
  /*
    If a random number between 0 and 100 is less than 90 (i.e. most of the 
    time), this comparison will return "true", which is also the value 1. A 
    saturation of 1 is a color, while saturation of 0 is white. So this makes 
    10% of the dust white.
  */
  if(rnum > 2 && rnum <= 3){
    s=1
  }else{
    s = random(100) < 85
  }
  
  /* 
    If a random decimal between 0 and 1 is over 0.995, then the value is 1 and 
    the pixel is on. Otherwise it's zero (off). Another way of thinking about
    this: The odds of a pixel being on are ~ 5-in-1000, or 1-in-200. 
  */
  v = random(1) > .91
  v =v*v*v
  hsv24(h, s, v)
}
// fast pulse 2D___________________________________________________________________
    
  // Make the highest brightness values (when v is greater than 0.8) white
  // instead of a saturated color
  
  

// house lights R W B____________________________________________


export var width = PI/2;
var horizontalSpacing = 3;
var verticalSpacing = 2.3;
export var verticalSweep = 5;
export var focus = 0.18;
export var speed = 80;
export var drive = 1.2;

// set default colors
var centerR = 0.0; var centerG = 0.7; var centerB = 0.12;
var edgeR = 0.34; var edgeG = .00; var edgeB = 0.98;

translate(-0.5,-0.5);


export function rgbPickerCenter(r,g,b) {
 centerR = r; centerG = g; centerB = b;  
}
export function rgbPickerEdge(r,g,b) {
  edgeR = r; edgeG = g; edgeB = b;
}
// controls brightness/desaturation of center beam
export function sliderWidth(v) {
  width = 0.00015+(v * PI/2)
}
// overall brightness & dispersion of each source
export function sliderFocus(v) {
  focus = .00015+v;
}
// goes to 11...
export function sliderDrive(v) {
  drive = 1 + (10*v*v);
}
export function sliderSpeed(v) {
  speed = 50+(100*v);
}
// vertical vs horizontal motion 
export function sliderVerticalSweep(v) {
  verticalSweep = 1+(5*v);
}


beforeRenders[1]=function(delta) {
  t1 = time(.1) * speed;
  t2 = 0.4*(-0.5+wave(time(0.08)));
  xOffset = t1 * 0.5;
  yOffset = t1 * 0.2;
}

var r,g,b,v;
var px,py,dx,dy;
var c,k0,k1;
renderers[1]=function(index,x,y) {
  r = 0;g = 0;b = 0;
  py = y + t2;  
  
  // process each of our 3 light sources
  for (var i = -1; i <= 1; i++) {
    px = t2+x + i/horizontalSpacing;
    v = i * verticalSpacing;
    dy = sin(yOffset+v);
    
    // is pixel within this source's visible region?
    if ((py*dy) < 0) {
      dx = sin(xOffset+v);
      c = px / py * dy * verticalSweep + dx;      
      if (abs(c) >= 2) continue;  
      
      // calculate intensity at this pixel
      // k0 is the brightness of the center beam
      // k1 is the brightness of the edge beams
      k0 = min(focus/abs(sin(c)),drive);
      k1 = min(focus/abs(sin(c-width)),drive);

      if (k0 > k1) {
        k0 = k0 * k0;
        r += k0 * centerR; 
        g += k0 * centerG;
        b += k0 * centerB;
      }
      else {
        k1 = k1 * k1;
        r += k1 * edgeR; 
        g += k1 * edgeG;
        b += k1 * edgeB;
      }
    }
  }
  
  // limit range, gamma correct and display
  r = clamp(0,1,r); g = clamp(0,1,g); b = clamp(0,1,b);
  rgb(r,g,b);
}
   


// Sp// Rotating checkerboard
beforeRenders[2] = function (delta) {
renderers[2] = function (index, x, y) {
  phi = PI2 * time(5/ 65.536)   // Rotation angle in radians. Try 8 seconds.
  x0 = 0.5; y0 = 0.5             // Center of rotation
  x = x - x0;  y = y - y0        // Shift the center to the origin
  _x = x * cos(phi) - y * sin(phi) + 3 * x0 // Rotate around origin and re-shift
  _y = y * cos(phi) + x * sin(phi) + 2 * y0
  t20 = time(3 / 65.536)         // Zoom scale and color. Try 3 seconds.
  blocks = 0.5 +3 * wave(t20)   // Number of blocks visible
  
  h = (_x + _y + t20 - 1)/5
  if (h > .65) { h = h%.65} 
  v = (1 + floor(1 + _x * blocks) + floor(1 + _y * blocks)) % 2 < 1;
  hsv(h,1,v) 
  
 
}
} 