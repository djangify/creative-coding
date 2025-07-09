//assets/art/animals/sketch.js
// A p5.js sketch for toddlers to tap cute animals
let animals = [];
const numAnimals = 10; // Fewer animals for toddlers
let score = 0;
let animalTypes = ['bunny', 'kitten', 'puppy', 'fox', 'bear', 'panda']; // Cute animals
let images = {};
let lastTouchPosition = { x: 0, y: 0 }; // Track last touch for toddlers

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Create animals spread around the canvas
  createAnimals(numAnimals);
}

function createAnimals(count) {
  for (let i = 0; i < count; i++) {
    // Spread animals randomly around canvas
    let x = random(100, width - 100);
    let y = random(100, height - 100);
    let type = random(animalTypes);

    animals.push(new Animal(
      x, y,
      100, // Big size for easier tapping
      type
    ));
  }
}

function draw() {
  background(240, 255, 240); // Light green background

  // Display score
  fill(50);
  textAlign(RIGHT);
  textSize(40);
  text(score, width - 40, 60);

  // Check for caught animals and update remaining ones
  for (let i = animals.length - 1; i >= 0; i--) {
    let animal = animals[i];

    // Update animal position (just a gentle wiggle)
    animal.update();

    // Check if animal is touched
    let touchedAnimal = false;

    // Check if mouse is over animal (for desktop)
    if (mouseIsPressed) {
      if (dist(mouseX, mouseY, animal.x, animal.y) < animal.size / 1.5) {
        touchedAnimal = true;
      }
    }

    // Check last touch position (for mobile)
    if (dist(lastTouchPosition.x, lastTouchPosition.y, animal.x, animal.y) < animal.size / 1.5) {
      touchedAnimal = true;
      // Reset touch position after using it
      lastTouchPosition = { x: 0, y: 0 };
    }

    // If animal is touched
    if (touchedAnimal) {
      // Simple effect when caught
      fill(255, 200, 200);
      noStroke();
      ellipse(animal.x, animal.y, animal.size);

      // Remove the animal
      animals.splice(i, 1);
      score++;

      // Add a new animal
      if (animals.length < 10) {
        createAnimals(1);
      }
    } else {
      // Display animal if not caught
      animal.display();
    }
  }

  // If running low on animals, add more
  if (animals.length < 5) {
    createAnimals(3);
  }
}

class Animal {
  constructor(x, y, size, type) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.type = type;

    // Animal emojis
    this.emoji = "🐰"; // Default
    if (type === 'bunny') this.emoji = "🐰";
    if (type === 'kitten') this.emoji = "🐱";
    if (type === 'puppy') this.emoji = "🐶";
    if (type === 'fox') this.emoji = "🦊";
    if (type === 'bear') this.emoji = "🐻";
    if (type === 'panda') this.emoji = "🐼";
  }

  update() {
    // Animals don't move - just stay in place for toddlers to tap
    // We could add a very gentle wiggle here if desired
  }

  display() {
    // Draw the animal emoji
    textSize(this.size);
    textAlign(CENTER, CENTER);
    text(this.emoji, this.x, this.y);
  }
}

// Handle touch events for mobile
function touchStarted() {
  // Store touch position for animal collision detection
  if (touches.length > 0) {
    lastTouchPosition.x = touches[0].x;
    lastTouchPosition.y = touches[0].y;
  }
  return false;
}

function touchMoved() {
  // Update touch position as finger moves
  if (touches.length > 0) {
    lastTouchPosition.x = touches[0].x;
    lastTouchPosition.y = touches[0].y;
  }
  return false;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}