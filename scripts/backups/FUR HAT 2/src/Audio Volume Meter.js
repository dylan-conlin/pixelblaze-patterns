/*
	Audio Volume Meter
	
		NOTE: Requires the PixelBlaze Sensor Expansion Board
	
	This pattern visualizes volume data from the PixelBlaze sensor expansion board. It uses several techniques to smooth out
	the display, but you can adjust this to you preference using the variables in the Audio Settings at the top of the script, 
	as well as the Blending (visual) and Decay (audio) UI sliders.
	
	Adjust the balance sliders to increase/reduce EQ of each frequency range to fit with your audio source.
	
	Use the 3 Sections toggle to switch between a 3 and 5 section display. It is designed for use with a horizontal strip,
	but you can customize the section layouts and fill directions as needed in the Section Maps at the bottom of the script.
	
	By default, each section displays the following frequency ranges and fill direction:
	
	  Frequencies:  Sub-Bass   Treble   Mids   Low-Mids   Mid-Bass
	         Fill:    --->      <-->    <-->    <-->       <---
	
	When using a 3 section display, the middle section uses are replaced with a large single section that uses 
	the loudest of the low-mid, mid, and treble frequencies.
	
	Table of Contents:
	
	  - Audio Settings
	  
	  - Initialization
	  
	  - beforeRender
	  
	  - render
	  
	  - Refresh Audio Data
	  
	  - PI Controller
	  
	  - UI Controls
	  
	  - Section Maps
	
	
	Created by jborcha.
*/

/* ----------------------------------------------------Audio Settings---------------------------------------------------- */
  
  // This section contains most of the variable settings that you'll want to play with
  
  // Main audio settings
  export var refreshRate = 40 // How often to refresh the sound frequency data (higher values produce less flicker)
  export var maxEnergy = 3  // Volume cap (used to measure frequency data as a percentage)
  var soundFloor = 0.0004     // Minimum sound level in a quiet room (gets subtracted from frequency data)
  var prevWeight = 2.5        // Weight applied to freq data from last refresh (lower = faster reactions, higher = smoother movements)
  
  // Sensitivity settings
  var targetMax = 0.35        // Percentage of the strip that the PI controller aims to have lit up
  var currentWeight = 0.1     // Multiplier used to weight the current sensitivity value (higher value favors current sensitivity)
  var targetWeight = 2        // Multiplier used to weight the target sensitivity value (higher value favors target sensitivity)
  var sensStart = 500         // Starting sensitivity value
  var sensMax = 5000          // Maximum sensitivity value
  var sensMin = 1
  
  // Frequency bin assignments for EQ
  // 
  // Frequency:  Bass   Low-Mids  High-Mids  Treble
  //     Bins:   0-1      2-3        4-6       7+
  var startBass = 0           // Starting freqAvgs bin for bass EQ
  var startLowMids = 2        // Starting freqAvgs bin for lower-mid EQ
  var startMids = 3           // Starting freqAvgs bin for upper-mid EQ
  var startTreb = 7           // Starting freqAvgs bin for treble EQ
  
  // Default EQ settings (use sliders to make adjustments)
  export var eqBass = 0.3     // EQ multiplier for low/bass frequencies
  export var eqLowMid = 0.8   // EQ multiplier for lower-mid frequencies
  export var eqMids = 2       // EQ multiplier for upper-mid frequencies
  export var eqTreb = 5       // EQ multiplier for high/treble frequencies


/* ----------------------------------------------------Initialization---------------------------------------------------- */

  // This section sets up the needed vars and arrays (not necessary to change these settings)

  // Initialize misc arrays for functions and data comparison between frames  (use default values)
  var pixel = array(pixelCount)     // Stores the brightness of each pixel in the current frame (calculated in beforeRender)
  export var freqAvgs = array(16)   // Stores the average of every 2 frequency bins (calculated in getFreqs function)
  export var mapFreq = array(6)     // Stores the EQ-adjusted frequency values, reduced to five bins (calculated in getFreqs function)
  var lastFreq = array(6)           // Stores the mapped frequency values for comparison in the next frame (in getFreqs function)
  var secTime = array(3)            // Array for section/time function values
  var lastVal = array(pixelCount)   // Array for storing the brightness level of each pixel from the previous frame
  
  // Initialize global array variables for the 5 section map (use default values)
  var sectPix = floor(pixelCount / 5)         // Number of pixels per section in 5 section display
  var fiveSectMid = array(5)             // Mid-points for each of the middle sections
  var fiveSectPct = array(pixelCount)     // Each pixel's location within its section, as a percentage
  var fiveSectFreqBin = array(pixelCount) // Frequency bin assignment for each pixel (based on its section)
  var fiveSect = array(10)

  // Initialize global variables for the 3 section map  (use default values)
  var threeSect = array(6)
  var threeSectMid = array(3)            // Stores mid-point of each section in 3 section display
  export var threeSectPct = array(pixelCount)    // Stores each pixel's fill percentage within its section
  var threeSectFreqBin = array(pixelCount)// Frequency bin assignment for each pixel (based on its section)
  
  // Run sectionSetup function to set up parameters for each section
  sectionSetup()
  
  // PI controller setup
  var sens                                  // Stores the dynamically calculated audio sensitivity multiplier
  var vFeedback                             // Stores the accumulated brightness of all pixels in each frame
  var piMax = round(sensMax / targetWeight) // Maximimum value for PI controller (derived from sensMax)
  var pic = makePIController(currentWeight, targetWeight, sensStart, sensMin, piMax)  // Initialize the PI controller
  
  // Initialize variables for functions and defaults for UI controls
  var fiveSectHue = [0,0,2,3,2,2] // Coefficients for small hue variations between sections
  var refTimer = 0            // Timer for keeping track of elapsed time to refresh frequency data
  var hueShift = 0            // Variable used to make small adjustments to color throughout each section
  var fader = 2.5             // Multiplier used to weight the previous frame's brightness (for smooth fading in/out)
  var decay = 0.99            // Percentage of the frequency data retained after each frame (control via slider)
  var sections = 5            // Default number of sections (3 Sections toggle)
  var color = 0.28            // Default static color (Color slider)
  var staticColor = 0         // Variable for enabling/disabling dynamically changing color (Cycle Color toggle)
  
  // Initialize frequency data from the sensor board
  export var frequencyData

  
/* ----------------------------------------------------beforeRender---------------------------------------------------- */

export function beforeRender(delta) {

  // Generate a wave to smoothly shift colors over time
  hueT = triangle(time(.75))
  hueShift = hueT * 0.025

  // Increase refTimer by number of miliseconds since previous frame
  refTimer += delta
  
  // Calculate sensitivity from PI controller
  sens = calcPIController(pic, targetMax - vFeedback / pixelCount)
  
  // Decay volume values with every frame so that they naturally fall between refreshes
  for (i = 0; i < mapFreq.length; i++) {
    mapFreq[i] = mapFreq[i] * decay
  }
  
  // Update frequency data whenever the timer surpasses the refreshRate
  if (refTimer > refreshRate) {
  	mapFreq = getFreqs()
  	refTimer = 0
  }
  
  // Reset brightness feedback so that it can be calculated for the next frame
  vFeedback = 0
  
}


/* ----------------------------------------------------render---------------------------------------------------- */

export function render(index) {
  
  // Get pixel placement and frequency data based on sections currently displayed
  if (sections == 3){
    // Get current pixel's placement within it's current section
    currSectPct = threeSectPct[index]
    // Check which frequency bin to use for the current pixel's section
    currFreqBin = threeSectFreqBin[index]
  } else {
    // Determine current pixel's placement within its current section
    currSectPct = fiveSectPct[index]
    // Check which frequency bin to use for the current pixel's section
    currFreqBin = fiveSectFreqBin[index]
  }
  
  // Turn on the pixel if its percentage value is less than the volume measurement of the current section
  if (currSectPct < mapFreq[currFreqBin]) {
    v = 1
  } else {
    v = 0
  }
  
  // Take an average of the current value and the faded value of the previous frame (use Blending slider to adjust)
  v = (v + (lastVal[index] * fader)) / (fader + 1)
  
  // Store brightness value for averaging the next frame, add this pixel to brightness feedback, 
  lastVal[index] = v
  vFeedback += v
  
  // Limit final brightness to value from 0..1 (causes problems if negative, or if it gets too high)
  // Since the pixel's brightness was already stored, we'll still get a reliable average between frames
  v = clamp(v, 0, 1)
  
  
  // If Cycle Colors in On, change hues with slight variation in each section
  if (staticColor < 1) {
    h = hueT + (v * 0.025) + (fiveSectHue[currFreqBin] * hueShift)
  }
  
  // If Cycle Colors in Off, use the Set Color value with slight variation in each section
  else if (color >= 0) {
	  h = color + (fiveSectHue[currFreqBin] * hueShift)
  }
  
  // If Cycle Colors in Off and Set Color is zero (0), use a multicolored rainbow pattern
  else {
	  h = hueShift + (1 - (currSectPct)) + hueT
  }
  
  hsv(h, 1, v)
  
}


/* ----------------------------------------------------Refresh Audio Data---------------------------------------------------- */

function getFreqs() {
  
  // Find the average every two frequencies and apply sensitivity adjustments
  var sum = 0
  for (var i = 0; i < frequencyData.length; i++) {
    
    // Add the current frequency bin data (minus the sound floor) to sum
    sum = sum + max(0, frequencyData[i] - soundFloor)
    
    // Get average of total frequency values for every two bins and apply sensitivity adjustment
    if ((i + 1) % 2 == 0) {
      freqAvgs[i / 2] = (sum / 2) * sens
      sum = 0;
    }
  }
  
  // Apply EQ adjustments to the averaged frequency data
  for (var i = 0; i < startLowMids; i++) {
    freqAvgs[i] *= eqBass
  }
  for (var i = startLowMids; i < startMids; i++) {
    freqAvgs[i] *= eqLowMid
  }
  for (var i = startMids; i < startTreb; i++) {
    freqAvgs[i] *= eqMids
  }
  for (var i = startTreb; i < freqAvgs.length ; i++) {
    freqAvgs[i] *= eqTreb
  }
  
  for (var i = 0; i < freqAvgs.length; i++) {
    
    // Treat values under 0.3 as zero (reduces flickering)
    if (freqAvgs[i] < 0.3) {
      freqAvgs[i] = 0
    } 
    // Measure the freq volume as a percentage of the maxEnergy variable (maxEndergy default is 2.5)
    else {
      freqAvgs[i] = (trunc(freqAvgs[i] * 100) * 0.005) / maxEnergy
    }
  }
  
  // Take the highest reading for frequencies within each section and limit the values to 0..1
  // Note: This setup doesn't use freqAvgs because it was constantly much higher than others for me
  freqAvgs[0] = clamp(freqAvgs[0], 0, 1)  // Sub-bass frequencies
  freqAvgs[1] = clamp(freqAvgs[1], 0, 1)   // Bass frequencies
  freqAvgs[2] = clamp(max(freqAvgs[3], freqAvgs[4]), 0, 1)   // Low-mid frequencies
  freqAvgs[3] = clamp(max(freqAvgs[5], freqAvgs[6]), 0, 1)  // Mid (vocal) frequencies
  freqAvgs[4] = clamp(max(freqAvgs[7], freqAvgs[8]), 0, 1)  // Treb frequencies
  
  // Take a weighted average of the current frequencies and the previous refresh (smoothes out noisy data)
  for (i = 0; i < mapFreq.length; i++) {
	  mapFreq[i] = (freqAvgs[i] + (mapFreq[i] * prevWeight)) / (prevWeight + 1)
  }
  
  // Use the loudest of the non-bass bins for middle section in 3 section display
  mapFreq[5] = max(mapFreq[3], max(mapFreq[4], mapFreq[5]))
  
  // Return the data
  return mapFreq
}


/* ----------------------------------------------------PI Controller---------------------------------------------------- */

  // Adjusts sensitivity after each frame (use variables in Audio Settings to make changes)
  function makePIController(kp, ki, start, min, max) {
    var pic = [kp,ki,start,min,max]
    return pic
  }
  function calcPIController(pic, err) {
    pic[2] = clamp(pic[2] + err, pic[3], pic[4])
    return max(pic[0] * err + pic[1] * pic[2], .3)
  }


/* ----------------------------------------------------UI Controls---------------------------------------------------- */

  // Toggle to use a static color (select using Color slider), or cycle colors dynamically
  export function toggleStaticColor(c) {
    staticColor = c
  }
  
  // Slider to set specific color when Static Color is enabled
  export function sliderColor(setColor) {
    
    // Pre-defined hues for each portion of the slider
    if (setColor > 0.85) {
      color = 0.685                 // Slider at 85-100% = Purple
    } else if (setColor > 0.60) {
      color = 0.635                 // Slider at 60-84% = Blue
    } else if (setColor > 0.35) {
      color = 0.28                  // Slider at 35-59% = Green
    } else if (setColor > 0.01) {
      color = 0                     // Slider at 1-34% = Red
    } else {
      color = -1                    // Slider at 0% = Rainbow
    }
  }
  
  // Slider to adjust bass EQ
  export function sliderBassBalance(b) {
    eqBass = (2 - 0.05) * (b) + 0.05        // Max: 2,  Min: 0.01
  }
  
  // Slider to adjust low-mid EQ
  export function sliderLowMidBalance(l) {
    eqLowMid = (2.5 - 0.05) * (l) + 0.05    // Max: 2.5,  Min: 0.01
  }
  
  // Slider to adjust mids EQ
  export function sliderMidsBalance(m) {
    eqMids = (4 - 0.5) * (m) + 0.5      // Max: 4,  Min: 0.25
  }
  
  // Slider to adjust treble EQ
  export function sliderTrebBalance(t) {
    eqTreb = (8 - 1) * (t) + 1            // Max: 8,  Min: 0.5
  }
  
  // Toggle to switch to 3 section display
  export function toggle3Sections(x) {
    if (x > 0) {
      sections = 3
    } else {
      sections = 5
    }
  }
  
  // Slider to adjust interframe fading (higher = slower fade)
  export function sliderBlending(f) {
    fader = (10 - 0.5) * (f) + 0.5        // Max: 10,  Min: 0.5
  }
  
  // Slider to adjust interframe frequency decay (higher = slower decay, low values may cause flickers)
  export function sliderDecay(f) {
    decay = (1 - 0.75) * (f) + 0.75       // Max: 1,  Min: 0.75
  }
  
  // Gauge to show current sensitivity level as a percentage
  export function gaugeSensitivity() {
    return (sens / sensMax)
  }


/* ----------------------------------------------------Section Maps---------------------------------------------------- */

function sectionSetup() {
  
  //--------------------------------------------------5 Section Map----------------------------------------------------//
  
  // Find the start/end points for five equally sized sections
  for (i = 0; i < 10; i = i + 2) {
    fiveSect[i] = (i / 2) * sectPix
  }
  for (i = 1; i < 10; i = i + 2) {
    fiveSect[i] = (fiveSect[i - 1]) + sectPix - 1
  }

  // Uncomment the following line and edit the values to manually define the section start/end points
  // fiveSect = [0,54,55,117,118,180,181,243,244,299]   // (StartSect1,EndSect1,StartSect2...)
  
  
  // Assigned frequency bin for each section
  // Frequencies: Sub-Bass    Treble    Mids    Low-Mids    Mid-Bass
  //        Bin:     0          4        3         2           1
  for (i = 0; i < pixelCount; i++) {
    if (i <= fiveSect[1]) {
      fiveSectFreqBin[i] = 0    // freqAvgs bin assigned to first section
    }
    else if (i <= fiveSect[3]) {
      fiveSectFreqBin[i] = 4    // freqAvgs bin assigned to second section
    }
    else if (i <= fiveSect[5]) {
      fiveSectFreqBin[i] = 3    // freqAvgs bin assigned to third section
    }
    else if (i <= fiveSect[7]) {
      fiveSectFreqBin[i] = 2    // freqAvgs bin assigned to fouth section
    }
    else if (i <= fiveSect[9]) {
      fiveSectFreqBin[i] = 1    // freqAvgs bin assigned to last section
    }
  }
  	
	// Mid-points for each section in the 5 section setup, offset by 0.5 to prevent empty pixels
	for (i = 0; i < 5; i++) {
	  fiveSectMid[i] = floor(((fiveSect[i * 2 + 1] - fiveSect[i * 2]) / 2) + (fiveSect[i * 2])) + 0.5
	}
	
	// Find each pixel's location within its section as a percentage from the start, end, or middle of the section
	for (i = 0; i <= fiveSect[1]; i++) {
		fiveSectPct[i] = (i) / (fiveSect[1] - fiveSect[0])                                  // Find percentage from start (-->)
	}
	for (i = fiveSect[2]; i <= fiveSect[3]; i++) {
		fiveSectPct[i] = (abs((fiveSectMid[1] - i) / ((fiveSect[3] - fiveSect[2]) / 2)))   // Find percentage from midpoint (<-->)
	}
	for (i = fiveSect[4]; i <= fiveSect[5]; i++) {
		fiveSectPct[i] = (abs((fiveSectMid[2] - i) /  ((fiveSect[5] - fiveSect[4]) / 2)))  // Find percentage from midpoint (<-->)
	}
	for (i = fiveSect[6]; i <= fiveSect[7]; i++) {
		fiveSectPct[i] = (abs((fiveSectMid[3] - i) /  ((fiveSect[7] - fiveSect[6]) / 2)))  // Find percentage from midpoint (<-->)
	}
	for (i = fiveSect[8]; i <= fiveSect[9]; i++) {
		fiveSectPct[i] = 1 - (i % fiveSect[8]) / (fiveSect[9] - fiveSect[8])               // Find percentage from end (<--)
	}
	  	
	// Uncomment the following lines to use percentage from mid-point (<-->) instead for the first & last sections
	// for (i = 0; i <= fiveSect[1]; i++) {
	// 	fiveSectPct[i] = (abs((fiveSectMid[0] - i) / ((fiveSect[1] - fiveSect[0]) / 2)))   // Find percentage from midpoint (<-->)
	// }
	// for (i = fiveSect[8]; i <= fiveSect[9]; i++) {
	// 	fiveSectPct[i] = (abs((fiveSectMid[4] - i) / ((fiveSect[9] - fiveSect[8]) / 2)))   // Find percentage from midpoint (<-->)
	// }
	
	
  //--------------------------------------------------3 Section Map----------------------------------------------------//
  
	// Set the start/end points for each section (combines the 3 middle sections from 5 section display into one large center section)
	threeSect[0] = fiveSect[0]
	threeSect[1] = fiveSect[1]
	threeSect[2] = fiveSect[1] + 1
	threeSect[3] = fiveSect[8] - 1
	threeSect[4] = fiveSect[8]
	threeSect[5] = fiveSect[9]
	
	// Uncomment the following line and edit the values to manually define the section start/end points
	// threeSect = [0,54,55,244,245,299]   // (StartSect1, EndSect1, StartSect2...)
	
	
	// Mid-points for each section in the 3 section setup, offset by 0.5 to prevent empty pixels
	for (i = 0; i < 3; i++) {
	  threeSectMid[i] = floor(((threeSect[i * 2 + 1] - threeSect[i * 2]) / 2) + (threeSect[i * 2])) + 0.5
	}
	
	// Assign frequency bins to use based on the section each pixel is in (bin 5 uses the loudest of low-mid, mids, and treb)
	//  Sub-Bass    Mids    Mid-Bass
	//	   0         5         1
	for (i = 0; i < pixelCount; i++) {
	  if (i <= threeSect[1]) {
	    threeSectFreqBin[i] = 0
	  } else if (i >= threeSect[2] && i <= threeSect[3]) {
	    threeSectFreqBin[i] = 5
	  } else {
	    threeSectFreqBin[i] = 1
	  }
	}
	
	// Percentage from the start for the first section
	for (i = 0; i <= threeSect[1]; i++) {
		threeSectPct[i] = (i) / (threeSect[1] - threeSect[0])  // Find percentage from start (-->)
	}
	// Percentage from section midpoint for the middle section
	for (i = threeSect[2]; i <= threeSect[3]; i++) {
	  threeSectPct[i] = (abs((threeSectMid[1] - i) /  ((threeSect[3] - threeSect[2]) / 2))) // Percentage from midpoint for center section (Fill from middle <-->)
	}
	// Percentage from the end for the last section
	for (i = threeSect[4]; i <= threeSect[5]; i++) {
	  threeSectPct[i] = 1 - (i % threeSect[4]) / (threeSect[5] - threeSect[4])   // Percentage from end for the last section (<--)
	}
	
	// Uncomment the following lines to fill first/last sections from the mid-point (<-->) instead
	// for (i = 0; i <= threeSect[1]; i++) {
	// 	threeSectPct[i] = (abs((threeSectMid[0] - i) / ((threeSect[1] - threeSect[0]) / 2)))   // Find percentage from midpoint (<-->)
	// }
	// for (i = threeSect[4]; i <= threeSect[5]; i++) {
	// 	threeSectPct[i] = (abs((threeSectMid[2] - i) / ((threeSect[5] - threeSect[4]) / 2)))   // Find percentage from midpoint (<-->)
	// }
  	
  }