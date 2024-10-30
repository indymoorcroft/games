let currMoleTile;
let currPlantTiles = [];
let score = 0;
let gameOver = false;
let timeLeft = 30;
let tileClickable = true;
let gameIntervalMole;
let gameIntervalPlants;

const maxLeaderboardEntries = 5;

// Game

function startGame() {
  const button = document.getElementById("start");
  const nameInput = document.getElementById("player-name");

  playerName = nameInput.value.trim();
  if (!playerName) {
    alert("Please enter your name to start the game");
    return;
  }

  button.disabled = true;
  nameInput.disabled = true;

  resetGame();

  setGame();

  startTimer();
}

function resetGame() {
  score = 0;
  gameOver = false;
  timeLeft = 30;
  tileClickable = true;
  currMoleTile = null;
  currPlantTiles = [];

  document.getElementById("score").innerText = score.toString();
  document.getElementById("timer").innerText = `Time: ${timeLeft}`;

  const board = document.getElementById("board");
  while (board.firstChild) {
    board.removeChild(board.firstChild);
  }

  clearInterval(gameIntervalMole);
  clearInterval(gameIntervalPlants);
}

function setGame() {
  for (let i = 0; i < 9; i++) {
    let tile = document.createElement("div");
    tile.id = i.toString();
    tile.addEventListener("click", selectTile);
    document.getElementById("board").appendChild(tile);
  }

  gameIntervalMole = setInterval(setMole, 750);
  gameIntervalPlants = setInterval(setPlants, 1500);
}

function startTimer() {
  const timer = document.getElementById("timer");
  timer.innerText = `Time: ${timeLeft}`;

  let timerInterval = setInterval(() => {
    if (gameOver) {
      clearInterval(timerInterval);
      return;
    }

    timeLeft -= 1;
    timer.innerText = `Time: ${timeLeft}`;

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      document.getElementById(
        "score"
      ).innerText = `TIME'S UP! Final Score: ${score}`;
      gameOver = true;
      document.getElementById("start").disabled = false;
      document.getElementById("player-name").disabled = false;

      saveScore(playerName, score);
    }
  }, 1000);
}

function getRandomTile() {
  let num = Math.floor(Math.random() * 9);
  return num.toString();
}

function setMole() {
  if (gameOver) return;

  if (currMoleTile) {
    currMoleTile.innerHTML = "";
  }

  let mole = document.createElement("img");
  mole.src = "./assets/monty-mole.png";

  let num = getRandomTile();

  if (currPlantTiles.some((plantTile) => plantTile.id === num)) {
    return;
  }

  currMoleTile = document.getElementById(num);
  currMoleTile.appendChild(mole);

  tileClickable = true;
}

function setPlants() {
  if (gameOver) return;

  currPlantTiles.forEach((tile) => (tile.innerHTML = ""));
  currPlantTiles = [];

  let plant1 = document.createElement("img");
  plant1.src = "./assets/piranha-plant.png";

  let plant2 = document.createElement("img");
  plant2.src = "./assets/piranha-plant.png";

  let num1 = getRandomTile();
  let num2 = getRandomTile();

  while (num1 === num2 || (currMoleTile && currMoleTile.id === num1)) {
    num1 = getRandomTile();
  }
  while (num2 === num1 || (currMoleTile && currMoleTile.id === num2)) {
    num2 = getRandomTile();
  }

  let plantTile1 = document.getElementById(num1);
  let plantTile2 = document.getElementById(num2);

  plantTile1.appendChild(plant1);
  plantTile2.appendChild(plant2);

  currPlantTiles.push(plantTile1, plantTile2);
}

function selectTile() {
  if (gameOver) return;

  if (this == currMoleTile) {
    score += 10;
    document.getElementById("score").innerText = score.toString();
  } else if (currPlantTiles.includes(this)) {
    document.getElementById("score").innerText =
      "GAME OVER: " + score.toString();
    gameOver = true;
    document.getElementById("start").disabled = false;
    document.getElementById("player-name").disabled = false;

    saveScore(playerName, score);
  }

  tileClickable = false;
}

// Leaderboard

function saveScore(name, score) {
  let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];

  leaderboard.push({ name: name, score: score });

  leaderboard.sort((a, b) => b - a);
  leaderboard = leaderboard.slice(0, maxLeaderboardEntries);

  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));

  displayLeaderboard();
}

function displayLeaderboard() {
  const leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];

  const leaderboardList = document.getElementById("leaderboard-list");
  leaderboardList.innerHTML = "";

  leaderboard.forEach((entry, index) => {
    const listItem = document.createElement("li");
    listItem.innerText = `${index + 1}. ${entry.name}: ${entry.score}`;
    leaderboardList.appendChild(listItem);
  });
}

displayLeaderboard();
