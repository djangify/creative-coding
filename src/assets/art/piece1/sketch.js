// Flowing Particles - piece1/sketch.js
let particles = [];
let flowField = [];
let cols, rows;
let zoff = 0;
let inc = 0.1;
let scl = 20;
let isPlaying = true;

function setup() {
  let canvas = createCanvas(800, 600);
  canvas.parent('sketch-container');

  cols = floor(width / scl);
  rows = floor(height / scl);

  // Initialize flow field
  flowField = new Array(cols * rows);

  // Create initial particles
  for (let i = 0; i < 300; i++) {
    particles.push(new Particle());
  }

  background(20, 25, 40);
}

function draw() {
  if (!isPlaying) return;

  // Create trailing effect
  fill(20, 25, 40, 25);
  noStroke();
  rect(0, 0, width, height);

  // Update flow field
  let yoff = 0;
  for (let y = 0; y < rows; y++) {
    let xoff = 0;
    for (let x = 0; x < cols; x++) {
      let index = x + y * cols;
      let angle = noise(xoff, yoff, zoff) * TWO_PI * 4;
      let v = p5.Vector.fromAngle(angle);
      v.setMag(1);
      flowField[index] = v;
      xoff += inc;
    }
    yoff += inc;
  }
  zoff += 0.005;

  // Update and display particles
  for (let particle of particles) {
    particle.follow(flowField);
    particle.update();
    particle.show();
    particle.edges();
  }
}

class Particle {
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.maxSpeed = 2;
    this.hue = random(360);
    this.prevPos = this.pos.copy();
  }

  follow(vectors) {
    let x = floor(this.pos.x / scl);
    let y = floor(this.pos.y / scl);
    let index = x + y * cols;
    let force = vectors[index];
    if (force) {
      this.applyForce(force);
    }
  }

  applyForce(force) {
    this.acc.add(force);
  }

  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.prevPos = this.pos.copy();
    this.pos.add(this.vel);
    this.acc.mult(0);

    // Slowly shift hue
    this.hue = (this.hue + 0.5) % 360;
  }

  show() {
    stroke(this.hue, 60, 90, 0.8);
    strokeWeight(1);
    line(this.pos.x, this.pos.y, this.prevPos.x, this.prevPos.y);

    // Add glowing effect
    stroke(this.hue, 40, 100, 0.3);
    strokeWeight(3);
    line(this.pos.x, this.pos.y, this.prevPos.x, this.prevPos.y);
  }

  edges() {
    if (this.pos.x > width) {
      this.pos.x = 0;
      this.prevPos.x = 0;
    }
    if (this.pos.x < 0) {
      this.pos.x = width;
      this.prevPos.x = width;
    }
    if (this.pos.y > height) {
      this.pos.y = 0;
      this.prevPos.y = 0;
    }
    if (this.pos.y < 0) {
      this.pos.y = height;
      this.prevPos.y = height;
    }
  }
}

function resetSketch() {
  particles = [];
  for (let i = 0; i < 300; i++) {
    particles.push(new Particle());
  }
  background(20, 25, 40);
}

function togglePlay() {
  isPlaying = !isPlaying;
}

function mousePressed() {
  // Add particles at mouse position
  for (let i = 0; i < 10; i++) {
    let p = new Particle();
    p.pos = createVector(mouseX + random(-20, 20), mouseY + random(-20, 20));
    particles.push(p);
  }
}

function windowResized() {
  resizeCanvas(800, 600);
  cols = floor(width / scl);
  rows = floor(height / scl);
  flowField = new Array(cols * rows);
}