delayFor = 10000;  //  How long before the pattern starts
displayFor = 300;     //  How long each LED stays lit

export var initialDelay = delayFor;
export var whichLED = 0;

totalTime = 0;
export function beforeRender(delta) {
  if (initialDelay > 0) initialDelay -= delta;
  else {
    totalTime += delta;
    if (totalTime > displayFor) {
      totalTime = 0;
      whichLED++;
      if (whichLED > pixelCount) {
        initialDelay = delayFor;
        whichLED = 0;
      }
    }
  }
}

export function render(index) {
  if ((initialDelay < 0) && (index == whichLED)) rgb(1,1,1);
  else rgb(0,0,0);
}

