let drops = Array(200);

function preload() {
  bgImg = loadImage('assets/background.jpg');
  featherImg = loadImage('assets/feather.png');
}

function setup() {
  rainSound = loadSound('assets/rain.mp3'); // broken in preload for some reason
  createCanvas(400, 500);
  createDrops();
  box = new Box();
  feather = new Feather();
  soundButton = new SoundButton();
  frameRate(80);
}

function createDrops() {
  for (let i = 0; i < drops.length; i++) {
    drops[i] = new Drop();
  }
}

function draw() {
  image(bgImg, 0, 0);
  soundButton.draw();
  drawRain();
  drawBox();
  drawFeather();
}

class SoundButton {

  constructor() {
    this.sound = rainSound;
    this.width = 100;
    this.height = 25;
  }

  toggle() {
    if (this.sound.isPlaying())
      this.sound.stop();
    else
      this.sound.loop();
  }

  draw() {
    fill(20, 20, 20, 200);
    stroke(255);
    rect(width - this.width, 0, width, this.height);
    stroke(0);
    fill(255);
    textSize(20);
    if (!this.sound.isPlaying()) {
      text('Sound off', width - this.width + 8, this.height - 5);
    } else {
      text('Sound on', width - this.width + 8, this.height - 5);
    }
  }
}

class Drop {

  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.minSpeed = 5;
    this.maxSpeed = 15;
    this.speed = random(this.minSpeed, this.maxSpeed);
  }

  move() {
    this.y += this.speed;
    if (this.y > height) {
      this.drawSplash();
      this.y = 0;
    }
  }

  draw() {
    let brightness = map(this.speed, this.minSpeed, this.maxSpeed, 90, 170);
    stroke(brightness, brightness, 255, 200);
    strokeWeight(map(this.speed, this.minSpeed, this.maxSpeed, 1, 4));
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
    this.maxAlpha = 100;
    this.minAlpha = 10;
    this.alpha = this.minAlpha;
  }

  move() {
    if (this.y > height - this.height * 2)
      this.speed -= 0.01;
    if (this.y < this.height)
      this.speed += 0.01;
    this.y += this.speed;
  }

  draw() {
    stroke(255);
    fill(180, 180 + this.alpha, 180, 50 + (this.alpha));
    rect(this.x, this.y, this.width, this.height, 10);
  }

  changeAlpha(inside) {
    if (inside && this.alpha < this.maxAlpha)
      this.alpha += 4;
    else if (box.alpha > this.minAlpha)
      this.alpha -= 3;
  }
}

class Feather {

  constructor() {
    this.img = featherImg;
    this.x = width / 2 - this.img.width / 2;
    this.y = height / 2;
    this.speed = 0;
    this.maxFallSpeed = 3;
    this.maxUpliftSpeed = -5;
  }

  move() {
    // lift if mouse pressed, else fall
    if (mouseIsPressed && this.speed > this.maxUpliftSpeed)
      this.speed -= 0.1;
    else if (this.speed < this.maxFallSpeed)
      this.speed += 0.05;
    // change pos
    this.y += this.speed;
    // stop if out of bounds
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

function mousePressed() {
  if (mouseX > width - 100 && mouseY < 25)
    soundButton.toggle();
}

function drawBox() {
  box.move();
  box.draw();
  middle = feather.y + feather.img.height / 2;
  if (middle > box.y && middle < box.y + box.height)
    box.changeAlpha(inside = true);
  else
    box.changeAlpha(inside = false);
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
