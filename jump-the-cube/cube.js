const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const card = document.getElementById("card");
const cardScore = document.getElementById("card-score");

let presetTime = 1000;
let enemySpeed = 5;
let score = 0;
let scoreIncrement = 0;
let canScore = true;

function startGame() {
  player = new Player(150, 350, 50, "black");
  arrayBlocks = [];
  score = 0;
  scoreIncrement = 0;
  enemySpeed = 5;
  canScore = true;
  presetTime = 1000;
}

function restartGame(button) {
  card.style.display = "none";
  button.blur();
  startGame();
  requestAnimationFrame(animate);
}

function drawBackgroundLine() {
  ctx.beginPath();
  ctx.moveTo(0, 400);
  ctx.lineTo(600, 400);
  ctx.lineWidth = 1.9;
  ctx.strokeStyle = "black";
  ctx.stroke();
}

function drawScore() {
  ctx.font = "80px Arial";
  ctx.fillStyle = "black";
  let scoreString = score.toString();
  let xOffset = (scoreString.length - 1) * 20;
  ctx.fillText(scoreString, 280 - xOffset, 100);
}

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomNumberInterval(timeInterval) {
  let returnTime = timeInterval;

  if (Math.random() < 0.5) {
    returnTime += getRandomNumber(presetTime / 3, presetTime * 1.5);
  } else {
    returnTime -= getRandomNumber(presetTime / 3, presetTime * 1.5);
  }

  return returnTime;
}

class Player {
  constructor(x, y, size, color) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;
    this.jumpHeight = 12;
    this.shouldJump = false;
    this.jumpCounter = 0;
    this.spin = 0;
    this.spinIncrement = 360 / 32;
  }

  rotation() {
    let offsetXPosition = this.x + this.size / 2;
    let offsetYPosition = this.y + this.size / 2;

    ctx.translate(offsetXPosition, offsetYPosition);

    ctx.rotate((this.spin * Math.PI) / 180);
    ctx.rotate((this.spinIncrement * Math.PI) / 180);

    ctx.translate(-offsetXPosition, -offsetYPosition);

    this.spin += this.spinIncrement;
  }

  counterRotation() {
    let offsetXPosition = this.x + this.size / 2;
    let offsetYPosition = this.y + this.size / 2;

    ctx.translate(offsetXPosition, offsetYPosition);

    ctx.rotate((-this.spin * Math.PI) / 180);

    ctx.translate(-offsetXPosition, -offsetYPosition);
  }

  jump() {
    if (this.shouldJump) {
      this.jumpCounter++;
      if (this.jumpCounter < 15) {
        this.y -= this.jumpHeight;
      } else if (this.jumpCounter > 14 && this.jumpCounter < 19) {
        this.y += 0;
      } else if (this.jumpCounter < 33) {
        this.y += this.jumpHeight;
      }

      this.rotation();

      if (this.jumpCounter >= 32) {
        this.counterRotation();
        this.spin = 0;
        this.shouldJump = false;
      }
    }
  }

  draw() {
    this.jump();
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.size, this.size);

    if (this.shouldJump) this.counterRotation();
  }
}

let player = new Player(150, 350, 50, "black");

class AvoidBlock {
  constructor(size, speed) {
    this.x = canvas.width + size;
    this.y = 400 - size;
    this.size = size;
    this.color = "red";
    this.slideSpeed = speed;
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.size, this.size);
  }
  slide() {
    this.draw();
    this.x -= this.slideSpeed;
  }
}

let arrayBlocks = [];

function generateBlocks() {
  let timeDelay = randomNumberInterval(presetTime);
  arrayBlocks.push(new AvoidBlock(50, enemySpeed));

  setTimeout(generateBlocks, timeDelay);
}

function squaresColliding(player, block) {
  let s1 = Object.assign(Object.create(Object.getPrototypeOf(player)), player);
  let s2 = Object.assign(Object.create(Object.getPrototypeOf(block)), block);

  s2.size = s2.size - 10;
  s2.x = s2.x + 10;
  s2.y = s2.y + 10;

  return !(
    s1.x > s2.x + s2.size ||
    s1.x + s1.size < s2.x ||
    s1.y > s2.y + s2.size ||
    s1.y + s1.size < s2.y
  );
}

function isPastBlock(player, block) {
  return (
    player.x + player.size / 2 > block.x + block.size / 4 &&
    player.x + player.size / 2 < block.x + (block.size / 4) * 3
  );
}

function shouldIncreaseSpeed() {
  if (scoreIncrement + 10 === score) {
    scoreIncrement = score;
    enemySpeed++;

    presetTime >= 100 ? (presetTime -= 100) : (presetTime = presetTime / 2);

    arrayBlocks.forEach((block) => {
      block.slideSpeed = enemySpeed;
    });
  }
}

let animationID = null;

function animate() {
  animationID = requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBackgroundLine();
  drawScore();

  player.draw();

  shouldIncreaseSpeed();

  arrayBlocks.forEach((arrayBlock, index) => {
    arrayBlock.slide();

    if (squaresColliding(player, arrayBlock)) {
      cardScore.textContent = score;
      card.style.display = "block";
      cancelAnimationFrame(animationID);
    }

    if (isPastBlock(player, arrayBlock) && canScore) {
      canScore = false;
      score++;
    }

    if (arrayBlock.x + arrayBlock.size <= 0) {
      setTimeout(() => {
        arrayBlocks.splice(index, 1);
      }, 0);
    }
  });
}

animate();
setTimeout(() => {
  generateBlocks();
}, randomNumberInterval(presetTime));

addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    if (!player.shouldJump) {
      player.jumpCounter = 0;
      player.shouldJump = true;
      canScore = true;
    }
  }
});
