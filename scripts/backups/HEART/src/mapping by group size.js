// Define the group size
var groupSize = 10; // Change this value to adjust the group size

// List of predefined colors (in HSV format)
// You can add or remove colors as needed
var colors = [
  [0.0, 1, 1],  // Red
  [0.1, 1, 1],  // Orange
  [0.16, 1, 1], // Yellow
  [0.33, 1, 1], // Green
  [0.66, 1, 1], // Blue
  [0.8, 1, 1]   // Violet
];

export function render(index) {
  // Define the group number
  var group = floor(index / groupSize);
  
  // Get the color for the current group
  // Use modulo to loop through the color list
  var color = colors[group % colors.length];
  
  // Convert HSV to RGB
  hsv(color[0], color[1], color[2]);
}
