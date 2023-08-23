/*
  Slow color shift
*/

l4 = pixelCount * 4     // 4 times the strip length

export function beforeRender(delta) {
  t1 = time(.15) * PI2
  t2 = time(.1)
}

angles = [ 3.107, 3.349, 3.567, 3.784, 4.001, 4.568, 4.351, 4.133, 3.914, 3.692, 4.261, 4.482, 4.701, 4.919, 5.137, 5.489, 5.271, 5.053, 4.833, 4.601, 5.183, 5.405, 5.624, 5.841, 6.059, 0.128, 6.194, 5.977, 5.759, 6.116, 0.047, 0.264, 0.480, 0.696, 1.263, 1.047, 0.832, 0.617, 0.404, 0.779, 0.970, 1.183, 1.397, 1.612, 2.176, 1.961, 1.747, 1.534, 1.324, 1.884, 2.095, 2.309, 2.524, 2.739, 3.087, 2.872, 2.657, 2.443, 2.233, 2.788, 3.004, 3.219, 3.436, 3.652 ];

export function render(index) {
  index = angles[index]
  
  h = (t2 + 1 + sin(index / 2 + 5 * sin(t1)) / 5) + index / l4

  v = wave((index / 2 + 5 * sin(t1)) / PI2)
  v = v * v * v * v

  hsv(h, 1, v)
}