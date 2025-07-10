// Simple random utility functions
const random = {
  range: (min, max) => Math.random() * (max - min) + min,
  rangeFloor: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
};

class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Agent {
  constructor(x, y) {
    this.pos = new Vector(x, y);
    this.vel = new Vector(random.rangeFloor(-1, 1) * 3, random.range(-1, 1));
    this.radius = random.range(8, 20);
  }

  bounce(width, height) {
    if (this.pos.x <= this.radius) {
      this.pos.x = this.radius;
      this.vel.x *= -1;
    }
    if (this.pos.x >= width - this.radius) {
      this.pos.x = width - this.radius;
      this.vel.x *= -1;
    }
    if (this.pos.y <= this.radius) {
      this.pos.y = this.radius;
      this.vel.y *= -1;
    }
    if (this.pos.y >= height - this.radius) {
      this.pos.y = height - this.radius;
      this.vel.y *= -1;
    }
  }

  update() {
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
  }

  draw(context) {
    context.save();
    context.translate(this.pos.x, this.pos.y);
    context.lineWidth = 4;
    context.fillStyle = 'silver';
    context.strokeStyle = 'silver';
    context.beginPath();
    context.arc(0, 0, this.radius, 0, Math.PI * 2);
    context.fill();
    context.stroke();
    context.restore();
  }
}

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function () {
  // Target the existing sketch container
  const container = document.getElementById('sketch-container');

  // Create canvas and add it to the container
  const canvas = document.createElement('canvas');
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.display = 'block';

  container.appendChild(canvas);

  // Set actual canvas dimensions based on container size
  function resizeCanvas() {
    const rect = container.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const context = canvas.getContext('2d');
  const agents = [];

  // Initialize agents
  function initAgents() {
    agents.length = 0; // Clear existing agents
    const numAgents = Math.min(140, Math.floor((canvas.width * canvas.height) / 8000));

    for (let i = 0; i < numAgents; i++) {
      const x = random.range(0, canvas.width);
      const y = random.range(0, canvas.height);
      agents.push(new Agent(x, y));
    }
  }

  initAgents();

  // Re-initialize agents when canvas resizes
  window.addEventListener('resize', function () {
    setTimeout(initAgents, 100); // Small delay to ensure canvas is resized
  });

  // Animation loop
  function animate() {
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);

    agents.forEach(agent => {
      agent.update();
      agent.draw(context);
      agent.bounce(canvas.width, canvas.height);
    });

    requestAnimationFrame(animate);
  }

  animate();
});