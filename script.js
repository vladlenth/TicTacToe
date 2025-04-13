function Player(name, identifier) {
    this.name = name;
    this.identifier = identifier;
}

let player1, player2;
let currentPlayer;

const player1Symbol = "X";
const player2Symbol = "O";

let gameBoard = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
];

// function "initializeGame"
function initializeGame() {
    const name1 = document.getElementById("player1Name").value.trim();
    const name2 = document.getElementById("player2Name").value.trim();

    if (!name1 || !name2) {
        alert("Пожалуйста, введите имена обоих игроков.");
        return; // no names entered
    }

    player1 = new Player(name1, player1Symbol);
    player2 = new Player(name2, player2Symbol);

    currentPlayer = player1;

    document.getElementById("playerNames").classList.add("hidden");
    document.getElementById("gameBoard").innerHTML = ""; // clear the board
    gameBoard = [["", "", ""], ["", "", ""], ["", "", ""]]; // reset board
    createBoard();
}

// function "createBoard"
function createBoard() {
    const boardElement = document.getElementById("gameBoard");

    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.dataset.row = row;
            cell.dataset.col = col;

            cell.addEventListener("click", () => handleCellClick(row, col));
            boardElement.appendChild(cell);
        }
    }
}

// function click on cell`s
function handleCellClick(row, col) {
   if (makeMove(gameBoard, row, col)) {
       const cell = document.querySelector(`.cell[data-row='${row}'][data-col='${col}']`);
       cell.textContent = currentPlayer.identifier;

       const winner = checkWinner(gameBoard);
       if (winner) {
           displayMessage(`Поздравляем! Победил ${currentPlayer.name}!`);
           endGame();
           return;
       }

       if (checkDraw(gameBoard)) {
           displayMessage("Игра закончилась вничью!");
           endGame();
           return;
       }

       currentPlayer = currentPlayer === player1 ? player2 : player1;
   }
}

// function "makeMove"
function makeMove(board, row, col) {
   if (board[row][col] === "") {
       board[row][col] = currentPlayer.identifier; // Player id
       return true;
   } else {
       alert("Эта ячейка уже занята. Попробуйте снова.");
       return false;
   }
}

// function "checkWinner"
function checkWinner(board) {
   for (let i = 0; i < 3; i++) {
       if (
           board[i][0] &&
           board[i][0] === board[i][1] &&
           board[i][0] === board[i][2]
       ) {
           return board[i][0]; // row winner
       }
       if (
           board[0][i] &&
           board[0][i] === board[1][i] &&
           board[0][i] === board[2][i]
       ) {
           return board[0][i]; // column winner
       }
   }

   if (
       board[0][0] &&
       board[0][0] === board[1][1] &&
       board[0][0] === board[2][2]
   ) {
       return board[0][0]; // main diagonal winner
   }

   if (
       board[0][2] &&
       board[0][2] === board[1][1] &&
       board[0][2] === board[2][0]
   ) {
       return board[0][2]; // diagonal winner
   }

   return null; // no winner
}

// function "checkDraw"
function checkDraw(board) {
   return board.flat().every((cell) => cell !== "");
}

// function "displayMessage"
function displayMessage(message) {
   const messageElement = document.getElementById("message");
   messageElement.textContent = message;

   const restartButton = document.getElementById("restartGame");
   restartButton.classList.remove("hidden"); // button "restartGame"

   restartButton.onclick = () => location.reload(); // reload page
}

// function "endGame"
function endGame() {
   const cells = document.querySelectorAll(".cell");
   cells.forEach(cell => cell.style.pointerEvents = "none");
}

// event on button "startGame"
document.getElementById("startGame").addEventListener("click", initializeGame);

