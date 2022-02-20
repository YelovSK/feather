let drops = Array(300);
let blurOn = false; // slow af on Firefox

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
  blurButton = new BlurButton();
  frameRate(80);
}

function createDrops() {
  for (let i = 0; i < drops.length; i++) {
    drops[i] = new Drop();
  }
}

function draw() {
  if (blurOn)
    drawingContext.filter = "blur(5px)";
  image(bgImg, 0, 0);
  drawRain();
  if (blurOn)
    drawingContext.filter = "blur(0px)";
  drawBox();
  drawFeather();
  soundButton.show();
  blurButton.show();
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

  show() {
    fill(20, 20, 20, 200);
    stroke(255);
    rect(width - this.width, 0, width, this.height);
    stroke(0);
    fill(255);
    textSize(20);
    let txt = "";
    if (!this.sound.isPlaying()) {
      txt = "Sound off";
    } else {
      txt = "Sound on";
    }
    text(txt, width - this.width + 8, this.height - 5);
  }
}

class BlurButton {

  constructor() {
    this.width = 80;
    this.height = 25;
  }

  toggle() {
    blurOn = !blurOn;
    drawingContext.filter = "none";
  }

  show() {
    fill(20, 20, 20, 200);
    stroke(255);
    rect(0, 0, this.width, this.height);
    stroke(0);
    fill(255);
    textSize(20);
    let txt = "";
    if (blurOn) {
      txt = "DoF on";
    } else {
      txt = "DoF off";
    }
    text(txt, 8, this.height - 5);
  }
}

class Drop {

  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.z = random(0, 10);
    this.weight = map(this.z, 0, 10, 1, 3);
    this.len = map(this.z, 0, 10, 3, 8);
    this.splashSize = map(this.z, 0, 10, 0.5, 1)
    this.minSpeed = 2;
    this.maxSpeed = 10;
    this.speed = map(this.z, 0, 10, this.minSpeed, this.maxSpeed);
  }

  move() {
    this.y += this.speed;
    if (this.y > height) {
      this.drawSplash();
      this.y = 0;
    }
  }

  show() {
    blur = map(this.z, 0, 10, 4, 0);
    if (blurOn)
      drawingContext.filter = "blur(" + blur + "1px)";
    stroke(170, 170, 255, 110 + this.z * 4);
    strokeWeight(this.weight);
    line(this.x, this.y, this.x, this.y + this.len);
  }

  drawSplash() {
    for (let x of [-9, -2, 2, 9]) {
      for (let y of [-4, -10, -10, -4]) {
        x *= this.splashSize;
        y *= this.splashSize;
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

  show() {
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

  show() {
    image(this.img, this.x, this.y);
  }
}

function mousePressed() {
  if (mouseX > width - soundButton.width && mouseY < 25)
    soundButton.toggle();
  else if (mouseX < blurButton.width && mouseY < blurButton.height)
    blurButton.toggle();
}

function drawBox() {
  box.move();
  box.show();
  middle = feather.y + feather.img.height / 2;
  if (middle > box.y && middle < box.y + box.height)
    box.changeAlpha(inside = true);
  else
    box.changeAlpha(inside = false);
}

function drawFeather() {
  feather.move();
  feather.show();
}

function drawRain() {
  for (let i = 0; i < drops.length; i++) {
    drops[i].move();
    drops[i].show();
  }
}
