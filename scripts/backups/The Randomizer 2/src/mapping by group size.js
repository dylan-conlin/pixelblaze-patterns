// Define the group size
var groupSize = 20; // Change this value to adjust the group size

// Golden ratio
var goldenRatio = 1.61803398875;

export function render(index) {
  // Define the group number
  var group = floor(index / groupSize);
  
  // Calculate a hue value based on the golden ratio
  var hue = (group * goldenRatio) % 1;
  
  // Convert hue to RGB
  hsv(hue, 1, 1);
}
