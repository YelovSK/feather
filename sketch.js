let drops = Array(200);

function setup() {
  createCanvas(400, 500);
  bgImg = loadImage('celeste.jpg');
  featherImg = loadImage('transparent.');
  rainSound = loadSound('sound.mp3');
  frameRate(80);
  createDrops();
  box = new Box();
  feather = new Feather();
}

function createDrops() {
  for (let i = 0; i < drops.length; i++) {
    drops[i] = new Drop();
  }
}

function draw() {
  image(bgImg, 0, 0);
  drawSoundButton();
  drawRain();
  drawBox();
  drawFeather();
}

class Drop {

  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.speed = random(5, 15);
  }

  move() {
    this.y += this.speed;
    if (this.y > height) {
      this.drawSplash();
      this.y = 0;
    }
  }

  draw() {
    stroke(100, 100, 255, 190);
    strokeWeight(map(this.speed, 5, 15, 1, 4));
    line(this.x, this.y, this.x, this.y + 10);
  }

  drawSplash() {
    for (const x of [+7, -7]) {
      for (const y of [-7, 0]) {
        line(this.x, height, this.x + x, height + y);
      }
    }
  }
}

class Box {

  constructor() {
    this.width = width / 1.8;
    this.height = this.width / 3;
    this.x = width / 2 - this.width / 2;
    this.y = height / 2;
    this.speed = 1;
    this.alpha = 0;
  }

  move() {
    if (this.y > height - this.height * 2)
      this.speed -= 0.01;
    if (this.y < this.height)
      this.speed += 0.01;
    this.y += this.speed;
  }

  draw() {
    fill(180, 180 + this.alpha, 180, 70 + (this.alpha / 1.5));
    rect(this.x, this.y, this.width, this.height, 10);
  }
}

class Feather {

  constructor() {
    this.img = loadImage('transparent.png');
    this.x = width / 2 - 100;
    this.y = height / 2;
    this.speed = 0;
    this.maxFallSpeed = 3;
    this.maxUpliftSpeed = -5;
  }

  move() {
    if (mouseIsPressed && this.speed > this.maxUpliftSpeed)
      this.speed -= 0.1;
    else if (this.speed < this.maxFallSpeed)
      this.speed += 0.05;
    this.y += this.speed;
    if (this.y > height) {
      this.y = height;
      this.speed = 0;
    } else if (this.y < -this.img.height) {
      this.y = -this.img.height;
      this.speed = 0;
    }
  }

  draw() {
    image(this.img, this.x, this.y);
  }
}

function drawSoundButton() {
  fill(20, 20, 20, 200);
  rect(width - 100, 0, width, 25);
  fill(255);
  textSize(20);
  if (!rainSound.isPlaying()) {
    text('Sound off', width - 90, 20);
  } else {
    text('Sound on', width - 90, 20);
  }
}

function drawBox() {
  box.move();
  box.draw();
  middle = feather.y + feather.img.height / 2;
  if (middle > box.y && middle < box.y + box.height && box.alpha < 100)
    box.alpha += 4;
  else if (box.alpha > 10)
    box.alpha -= 3;
}

function drawFeather() {
  feather.move();
  feather.draw();
}

function drawRain() {
  for (let i = 0; i < drops.length; i++) {
    drops[i].move();
    drops[i].draw();
  }
}

function mousePressed() {
  if (mouseX > width - 100 && mouseY < 25) {
    if (rainSound.isPlaying())
      rainSound.stop();
    else
      rainSound.loop();
  }
}
