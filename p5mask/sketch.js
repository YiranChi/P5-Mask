let outputWidth;
let outputHeight;

let faceTracker; 
let videoInput;

let imgSpidermanMask; 
let imgDogEarRight, imgDogEarLeft, imgDogNose; 

let selected = -1; 

function preload()
{
  imgSpidermanMask = loadImage("images/1.png");
}

function setup()
{
  const maxWidth = Math.min(windowWidth, windowHeight);
  pixelDensity(1);
  outputWidth = maxWidth;
  outputHeight = maxWidth * 0.75;

  createCanvas(outputWidth, outputHeight);

  videoInput = createCapture(VIDEO);
  videoInput.size(outputWidth, outputHeight);
  videoInput.hide();

  const sel = createSelect();
  const selectList = ['P5 Mask']; 
  sel.option('Select Filter', -1); 
  for (let i = 0; i < selectList.length; i++)
  {
    sel.option(selectList[i], i);
  }
  sel.changed(applyFilter);

  faceTracker = new clm.tracker();
  faceTracker.init();
  faceTracker.start(videoInput.elt);
}

function applyFilter()
{
  selected = this.selected(); 
}

function draw()
{
  image(videoInput, 0, 0, outputWidth, outputHeight); 

  switch(selected)
  {
    case '-1': break;
    case '0': drawMask(); break;
  }
}

function drawMask()
{
  const positions = faceTracker.getCurrentPosition();
  if (positions !== false)
  {
    push();
    const wx = Math.abs(positions[13][0] - positions[1][0]) * 1.2; 
    const wy = Math.abs(positions[7][1] - Math.min(positions[16][1], positions[20][1])) * 1.2;
    translate(-wx/2, -wy/2-5);
    image(imgSpidermanMask, positions[41][0], positions[41][1], wx, wy); 
    pop();
  }
}

function windowResized()
{
  const maxWidth = Math.min(windowWidth, windowHeight);
  pixelDensity(1);
  outputWidth = maxWidth;
  outputHeight = maxWidth * 0.75; // 4:3
  resizeCanvas(outputWidth, outputHeight);
}