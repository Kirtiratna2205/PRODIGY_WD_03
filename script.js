const resetMatchBtn = document.getElementById("resetMatchBtn");

let scoreX = 0;
let scoreO = 0;
let scoreDraw = 0;

const scoreXEl = document.getElementById("scoreX");
const scoreOEl = document.getElementById("scoreO");
const scoreDrawEl = document.getElementById("scoreDraw");

const modeScreen = document.getElementById("modeScreen");
const gameScreen = document.getElementById("gameScreen");
const friendBtn = document.getElementById("friendBtn");
const computerBtn = document.getElementById("computerBtn");
const statusText = document.getElementById("statusText");
const restartBtn = document.getElementById("restartBtn");
const cells = document.querySelectorAll(".cell");

let gameMode = "";
let currentPlayer = "X";
let board = ["", "", "", "", "", "", "", "", ""];
let gameActive = true;

const winPatterns = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

// -------- Mode Selection --------
friendBtn.addEventListener("click", () => startGame("friend"));
computerBtn.addEventListener("click", () => startGame("computer"));

function startGame(mode) {
  gameMode = mode;
  modeScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");
  resetGame();
}

// -------- Cell Click --------
cells.forEach(cell => {
  cell.addEventListener("click", () => handleCellClick(cell));
});

function handleCellClick(cell) {
  const index = cell.getAttribute("data-index");

  if (board[index] !== "" || !gameActive) return;

  makeMove(index, currentPlayer);

  // only computer plays after human move
  if (gameMode === "computer" && currentPlayer === "O" && gameActive) {
    setTimeout(computerMove, 400);
  }
}


// -------- Make Move --------
function makeMove(index, player) {
  board[index] = player;
  cells[index].textContent = player;

  if (checkWinner()) return;

  // ---- Draw check ----
  if (!board.includes("")) {
    statusText.textContent = "It's a Draw!";
    gameActive = false;

    scoreDraw++;
    scoreDrawEl.textContent = scoreDraw;
    return;
  }

  currentPlayer = player === "X" ? "O" : "X";
  statusText.textContent = `Player ${currentPlayer}'s Turn`;
}

// -------- Winner Check --------
function checkWinner() {
  for (let pattern of winPatterns) {
    const [a,b,c] = pattern;

    if (
      board[a] &&
      board[a] === board[b] &&
      board[a] === board[c]
    ) {
      statusText.textContent = `Player ${board[a]} Wins!`;
      gameActive = false;

      if (board[a] === "X") {
        scoreX++;
        scoreXEl.textContent = scoreX;
      } else {
        scoreO++;
        scoreOEl.textContent = scoreO;
      }
      return true;
    }
  }
  return false;
}

// -------- Computer Move --------
function computerMove() {
  if (!gameActive) return;

  let emptyIndexes = board
    .map((v,i) => v === "" ? i : null)
    .filter(v => v !== null);

  let randomIndex =
    emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];

  makeMove(randomIndex, "O");
}

// -------- Restart Game (only board) --------
restartBtn.addEventListener("click", resetGame);

function resetGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  cells.forEach(cell => cell.textContent = "");
  currentPlayer = "X";
  gameActive = true;
  statusText.textContent = "Player X's Turn";
}

// -------- Reset Match (board + score) --------
resetMatchBtn.addEventListener("click", resetMatch);

function resetMatch() {
  // reset scores
  scoreX = 0;
  scoreO = 0;
  scoreDraw = 0;

  scoreXEl.textContent = scoreX;
  scoreOEl.textContent = scoreO;
  scoreDrawEl.textContent = scoreDraw;

  // reset board also
  resetGame();
}
