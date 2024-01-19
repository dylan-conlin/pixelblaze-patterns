/*  
  Requires sensor board and intended for use with 1D light strips. The brightness of each section 
  of the strip corresponds to a given audio frequency range. Sensitivity is adjusted automatically.
  Each main frequency band (low, mid, high) is equalized using variables, so you may need to adjust
  them to account for your room setup if you see certain sections staying dark/bright for too long.
  
  Created by jborcha. Built on the shoulders of the Pixelblaze community.
*/ 
  
/* -----------------------------------------Variables------------------------------------------ */
  
  var sections = 12   // Total number of sections to split the strip into (recommended range: 6-12)
  var sectPixels = pixelCount / sections  // Number of pixels in each section
  var refreshRate = 10  // How often to refresh the sound frequency data (higher values produce less flicker)
  var targetMax = .2    // Percentage of the strip the sensitivity will try to have lit up simultaneously
  
  export var bassAdjust = 0.05 // EQ multiplier for low/bass frequencies
  export var midLowAdjust = 1.00  // EQ multiplier for lower-mid frequencies
  export var midHighAdjust = 1.75  // EQ multiplier for upper-mid frequencies
  export var trebAdjust = 2.0  // EQ multiplier for high/treble frequencies
  
  export var midLow = ceil(sections * 0.2)  // Starting section for lower-mid EQ
  export var midHigh = ceil(sections * 0.3)  // Starting section for upper-mid EQ
  export var trebStart = ceil(sections * 0.7)   // Starting section for treble EQ

  var timer = 0
  var sat = 1
  var hue

/* ----------------------------------------Array Variables------------------------------------- */

  export var freqAvgs = array(16)	    // Reduced frequency values (average of every 2 freqs)
  var pixels = array(pixelCount + 1)	// Calculated brightness of each pixel
  var lastVal = array(pixelCount + 1)     // Calculated brightness of each pixel from the previous frame
  var startSection = array(sections)	// Starting pixel of each section
  var endSection = array(sections)		// Ending pixel of each section
  
  // Find start/end points for each section
  for(i = 0; i < sections; i++) {
	  startSection[i] = round(sectPixels * i)
	  endSection[i] = round(startSection[i] + sectPixels - 1)
  }

/* ----------------------------------------UI Sliders----------------------------------------- */
  
  // Slider to enable/disable rainbow coloring
  var  rainbow = 1
  export function sliderRainbow(setRainbow) {
      rainbow = setRainbow > 0.2   // Enable rainbow effect if slider is not set to zero
  }

  
  // Slider to enable/disable color cycling when rainbow is disabled
  var colorShift = 0
  export function sliderColorShift(setColorShift) {
      colorShift = setColorShift > 0.2  // Convert slider value to 0.15..2.0
  }
  
  export var  color = 0.667
  export function sliderColor(setColor) {
      if (setColor > 0.8) {
        color = 0.9
      } else if (setColor > 0.6) {
        color = 0.695
      } else if (setColor > 0.35) {
        color = 0.667
      } else if (setColor > 0.15) {
        color = 0.334
      } else {
        color = 0
      }
  }

/* ----------------------------------------PI Controller----------------------------------------- */

  export var frequencyData
  
  export var sens
  var vFeedback = 0		// Total brightness level of all pixels in each frame (for feedback into the PI controller)
  
  // Create PI controller to dynamically adjust mic sensitivity to account for current volume levels
  var pic = makePIController(.0125, 2, 500, 0, 700)
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
    return max(pic[0] * err + pic[1] * pic[2], .3)
  }

/* ----------------------------------------Frequency Data----------------------------------------- */

function getFreqs(sens) {
  
  // Find the average every two frequencies and apply sensitivity adjustments
  var sum = 0
  for (var i = 0; i < frequencyData.length; i++) {
    sum = sum + frequencyData[i]
    if ((i + 1) % 2 == 0) {
      freqAvgs[i / 2] = (sum / 2) * sens
      sum = 0;
    }
  }
  
  // Apply EQ adjustments to the reduced frequency data
  for (var i = 0; i < midLow; i++) {
    freqAvgs[i] *= bassAdjust
  }
  for (var i = midLow; i < midHigh; i++) {
    freqAvgs[i] *= midLowAdjust
  }
  for (var i = midHigh; i < trebStart; i++) {
    freqAvgs[i] *= midHighAdjust
  }
  for (var i = trebStart; i <= sections ; i++) {
    freqAvgs[i] *= trebAdjust
  }
  
  for (var i = 0; i < freqAvgs.length; i++) {
    if (freqAvgs[i] < 1) {
      freqAvgs[i] = 0
    } else {
      freqAvgs[i] = clamp(ceil(freqAvgs[i]),0,10) * 0.5
    }
  }
  
  return freqAvgs
}

/* ----------------------------------------beforeRender----------------------------------------- */

export function beforeRender(delta) {
  
  // Increase timer by number of miliseconds since previous frame
  timer+= delta
  
  // Generate wave with the Color Shift slider value
  hueT = triangle(time(0.5))
  
  // Calculate sensitivity from PI controller and then reset brightness feedback
  sens = calcPIController(pic, targetMax - vFeedback / pixelCount)
  vFeedback = 0
  
  // Update frequency data whenever the timer surpasses the refreshRate
  if (timer > refreshRate) {
  	freqAvgs = getFreqs(sens)
  	timer = 0
  }
  
  // Set brightness for pixels in each frequency section
  for (s = 0; s < sections; s++) {
	  for (x = startSection[s]; x <= endSection[s]; x++) {
		  pixels[x] = (freqAvgs[s] + (lastVal[x] * 4)) / 5
		  lastVal[x] = pixels[x]
		  // Update brightness feedback for use in calculating sensitivity
		  vFeedback += pixels[x]
	  }
  }
}

/* ----------------------------------------render----------------------------------------- */

export function render(index) {
  
  // Set brightness for the current pixel from calculated values stored in the array
  v = pixels[index]
  
  // Limit final brightness to values from 0..1 to prevent potential issues from high brightness
  v = clamp(v, 0, 1)
  
  // Use rainbow across strip if the slider value is greater than zero
  if (rainbow > 0){
    hue = 1 - (triangle((sections / (sections * 1.75)) * index / pixelCount)  + hueT)
  }
  // If rainbow is off and color shift is on, cycle through color shades
  else if (colorShift > 0) {
    hue = triangle((sections / 4) * index / pixelCount) * .02 + hueT
  }
  else {
    hue = color
  }
  
  hsv(hue, sat, v)
}