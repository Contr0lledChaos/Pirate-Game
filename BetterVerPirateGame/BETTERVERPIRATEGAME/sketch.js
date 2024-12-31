const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;



var engine, world, backgroundImg;
var canvas, angle, tower, ground, cannon;
var balls = [];

var boat;
var boats = [];

var score = 0;

let explosionTimer = 0;
let explosionX = null;
let explosionY = null;

let splashTimer = 0;
let splashX = null;
let splashY = null;

let gameOver = false;

function preload() {
  backgroundImg = loadImage("./assets/background.gif");
  towerImage = loadImage("./assets/tower.png");
  explImage = loadImage("./assets/explosion.png");
  splashImage = loadImage("./assets/splash.png");
}

function setup() {
  canvas = createCanvas(1200, 600);
  engine = Engine.create();
  world = engine.world;
  angleMode(DEGREES);
  angle = 15;

  ground = Bodies.rectangle(0, height - 1, width * 2, 1, { isStatic: true });
  World.add(world, ground);

  tower = Bodies.rectangle(160, 350, 160, 310, { isStatic: true });
  World.add(world, tower);

  cannon = new Cannon(180, 110, 130, 100, angle);

  
}

function draw() {
  background(189);
  image(backgroundImg, 0, 0, width, height);

  if (gameOver == false){
    Engine.update(engine);
    rect(ground.position.x, ground.position.y, width * 2, 1);

    push();
    imageMode(CENTER);
    image(towerImage,tower.position.x, tower.position.y, 160, 310);
    pop();

    textSize(20);
    fill("red");
    textAlign(CENTER);
    text("Score: "+score, width / 2, 35);
    text("Press down arrow to shoot, left and right arrows to adjust canon angle", width / 2, 65);
    text("Keep the pirates from reaching the tower!", width / 2, 90);
    

    for (var i = 0; i < balls.length; i++) {
      showCannonBalls(balls[i]);
    }

    for (var i = 0; i < balls.length; i++) {
      for (var j = 0; j < boats.length; j++) {
        if (balls[i] !== undefined && boats[j] !== undefined) {
          var hit = detectCollision(balls[i], boats[j]);
          if (hit) {
            explosionTimer = 25;
            explosionX = boats[j].body.position.x;
            explosionY = boats[j].body.position.y;
        
            World.remove(world, boats[j].body);
            boats.splice(j, 1);
  
            World.remove(world, balls[i].body);
            balls.splice(i, 1);
  
            score++;

            break;
          }
          else if (balls[i].body.position.y > height-75){
            splashTimer = 25;
            splashX = balls[i].body.position.x;
            splashY = balls[i].body.position.y;

            World.remove(world, balls[i].body);
            balls.splice(i, 1);
          }
        }
    }
  }

    if (explosionTimer > 0) {
      push();
      imageMode(CENTER);
      image(explImage, explosionX, explosionY, 200, 200);
      pop();
      explosionTimer--;
    }
  
    if (splashTimer > 0) {
      push();
      imageMode(CENTER);
      image(splashImage, splashX, splashY, 200, 200);
      pop();
      splashTimer--;
    }

    cannon.display();
    showBoat();
  }
  else{
    textSize(64);
    fill("red");
    textAlign(CENTER);
    text("GAME OVER", width / 2, height / 2);  
    textSize(32);  
    text("Press R to restart!", width / 2 , (height / 2)+ 50);
  }
  
}

function keyPressed() {
  if (keyCode === DOWN_ARROW) {
    var cannonBall = new CannonBall(cannon.x, cannon.y);
    cannonBall.trajectory = [];
    Matter.Body.setAngle(cannonBall.body, cannon.angle);
    balls.push(cannonBall);
  }
}

function showCannonBalls(ball) {
  if (ball) {
    ball.display();
  }
}

function keyReleased() {
  if (keyCode === DOWN_ARROW) {
    balls[balls.length - 1].shoot();
  }

  if (gameOver && keyCode === 82) {
    restart();
  }
}

function showBoat() {
  if (boats.length>0){
    if (boats[boats.length-1]==undefined||boats[boats.length-1].body.position.x<width-300){
      var positions = [-40, -60, -70, -20]
      var position = random(positions)
      boat = new Boat(width-79, height-60, 170, 170, position);
      boats.push(boat);
    }
    for (var i = 0; i< boats.length; i++){
      if (boats[i]){
        Matter.Body.setVelocity(boats[i].body, {x:-0.9, y:0})
        boats[i].display();

        if (boats[i].body.position.x < 330) { // Adjust threshold as needed
          gameOver = true;
        }
      }
    }
  }
  else{
    boat = new Boat(width-79, height-60, 170, 170, -80);
    boats.push(boat);
  }
}

function detectCollision(ball, boat) {
  var collision = Matter.SAT.collides(ball.body, boat.body);
  return collision.collided; // Returns true if the bodies are colliding
}

function restart() {
  // Reset game state
  gameOver = false;

  // Clear boats and balls arrays
  boats = [];
  balls = [];

  score = 0;

  // Reinitialize essential game objects
  World.clear(world); // Clears all physics bodies from the Matter.js world
  engine = Engine.create();
  world = engine.world;

  // Reinitialize the tower
  tower = Bodies.rectangle(160, 350, 160, 310, { isStatic: true });
  World.add(world, tower);

  // Reinitialize the cannon
  cannon = new Cannon(180, 110, 130, 100, angle);

  // Reinitialize the ground
  ground = Bodies.rectangle(0, height - 1, width * 2, 1, { isStatic: true });
  World.add(world, ground);
}


