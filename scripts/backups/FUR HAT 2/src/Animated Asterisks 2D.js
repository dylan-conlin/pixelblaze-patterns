///////////////////////////////////////////////////
//
//  Matrix configuration
//
var matrixWidth = sqrt(pixelCount);


///////////////////////////////////////////////////
//
//  UI settings
//

//  The number of lines in the asterisk.
var maxLines = 50;
export var numLines = 6; 
// If you are using the WS2812B LED type and are getting garbage in the first row for numLines > 2 or 3, 
// it's probably because the line distance function is too heavy to calculate inside the render() function.
// With the LED type set to "double-buffered WS2812B" it works fine up to 50 or 60 lines (!).
export function sliderNumLines(v) { numLines = 1 + floor((maxLines - 1) * v); }

//  The width of the lines.
export var lineWidth = 0.1 / matrixWidth;
// A LineWidth less than 0.25 or so gives some very interesting particle effects; a lineWidth greater than 1
// starts to occupy the entire matrix and gives a different effect.  
export function sliderLineWidth(v) { lineWidth = newLineWidth(v); }
function newLineWidth(v) { return (0.01 + (matrixWidth / numLines) * v) / matrixWidth; }

//  When set, varies the lineWidth over the course of several seconds to show different effects.
export var animateWidth = 1;
export function sliderAnimateWidth(v) { animateWidth = 1 - floor(1 - v); }

//  The speed of rotation
export var rotationSpeed = 0.031;
export function sliderRotationSpeed(v) { rotationSpeed = 0.005 + .045 * (1-v)*(1-v); }

//  The speed of color change
export var colorSpeed = 0.2;
export function sliderColorSpeed(v) { colorSpeed = 0.01 + .39 * (1-v)*(1-v); }

///////////////////////////////////////////////////
//
//  Pattern storage
//
var xBegin = array(maxLines);
var yBegin = array(maxLines);
var xEnd = array(maxLines);
var yEnd = array(maxLines);
var lineHue = array(maxLines);


///////////////////////////////////////////////////
//
//  Render functions
//
var centerX = 0.5;
var centerY = 0.5;
export function beforeRender(delta) {
  newAngle = time(rotationSpeed) * PI2;
  newColor = time(colorSpeed);
  if (animateWidth > 0) lineWidth = newLineWidth(triangle(time(1)));
  for (line=0;line<numLines;line++) {
    //  Change the color.
    lineHue[line] = (newColor + (line / numLines)) % 1;
    //  calculate new position.
    thisAngle = newAngle + PI * line / numLines;
    horizontal = cos(thisAngle) / 2;
    vertical = sin(thisAngle) / 2;
    xBegin[line] = centerX + horizontal;
    xEnd[line] = centerX - horizontal;
    yBegin[line] = centerY + vertical;
    yEnd[line] = centerY - vertical;
  }
}


function pointDistanceFromLine(Px, Py, Ax, Ay, Bx, By) {
  // vector AB
  ABx = Bx - Ax; ABy = By - Ay;
  // vector BP
  BPx = Px - Bx; BPy = Py - By;
  // vector AP
  APx = Px - Ax; APy = Py - Ay;

  // There are three possibilities:
  if ((ABx * APx + ABy * APy) < 0) {    // outside the near endpoint => negative dot product
    return sqrt(APx * APx + APy * APy);
  }
  else if ((ABx * BPx + ABy * BPy) > 0) {    // outside the far endpoint => positive dot product
    return sqrt(BPx * BPx + BPy * BPy);
  }
  else {
    // We're somewhere in the middle
    return abs(ABx * APy - ABy * APx) / sqrt(ABx * ABx + ABy * ABy);
  }
}


export function render2D(index, xPoint, yPoint) {
  for (line=0;line<numLines;line++) {
    distance = pointDistanceFromLine(xPoint, yPoint, xBegin[line], yBegin[line], xEnd[line], yEnd[line]);
    if (distance < lineWidth) { 
      hsv(lineHue[line], 1, 1 - distance / lineWidth); 
      return; 
    }
  }
  hsv(0, 0, 0);
}
