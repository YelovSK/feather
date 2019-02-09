var vyska, speed, rychlost = 1,
  x,
  y, sirka = 100,
  feather,rain,transp=0;

function setup() {
  createCanvas(400, 500);
  vyska = height / 2 - 50;
  speed = 0;
  x = width / 2 - 50;
  strokeWeight(3);
  feather = loadImage('transparent.png');
  rain=loadImage('rain.png');
  image(rain,0,0);
  y = height / 2;
  textSize(50);
  fill(color, color, color, 0);
}

function draw() {
  image(rain,0,0);
  fill(180, 180+transp, 180, 70);
  rect(80, y, 250, 80, 10);
  image(feather, x - 50, vyska);
  y = y + rychlost;
  if (y > height - 150) {
    rychlost = rychlost - 0.01;
  }
  if (y < 100) {
    rychlost = rychlost + 0.01;
  }
  
  vyska = vyska + speed;
  if (mouseIsPressed == true) {
    speed = speed - 0.1;
  } else {
    {
      (speed = speed + 0.05);
    }

  }
  if (speed > 3) {
    speed = 3
  };
  if (vyska > height) {
    vyska = height;
    speed = 0;
  } else if (vyska < -100) {
    vyska = 0 - 100;
    speed = 0;
  }
  if (vyska + 10 > y && vyska + 10 < y + 50) {

    if (transp < 65) {
      transp = transp + 4;
    }

  } else {
    if (transp > 0) {
      transp = transp - 3;
    }
  }


}