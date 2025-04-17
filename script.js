// === Model ===
const Model = (() => {
    let player1 = null;
    let player2 = null;
    let currentPlayer = null;

    let gameBoard = [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""],
    ];

    function createPlayer(name, symbol) {
        return { name, symbol };
    }

    function initializePlayers(name1, name2) {
        player1 = createPlayer(name1, "X");
        player2 = createPlayer(name2, "O");
        currentPlayer = player1;
        resetBoard();
    }

    function resetBoard() {
        gameBoard = [["", "", ""], ["", "", ""], ["", "", ""]];
    }

    function getBoard() {
        return gameBoard;
    }

    function getCurrentPlayer() {
        return currentPlayer;
    }

    function switchPlayer() {
        currentPlayer = currentPlayer === player1 ? player2 : player1;
    }

    function makeMove(row, col) {
        if (gameBoard[row][col] === "") {
            gameBoard[row][col] = currentPlayer.symbol;
            return true;
        }
        return false;
    }

    function checkWinner() {
        const b = gameBoard;
        for (let i = 0; i < 3; i++) {
            if (b[i][0] && b[i][0] === b[i][1] && b[i][0] === b[i][2]) return true;
            if (b[0][i] && b[0][i] === b[1][i] && b[0][i] === b[2][i]) return true;
        }
        if (b[0][0] && b[0][0] === b[1][1] && b[0][0] === b[2][2]) return true;
        if (b[0][2] && b[0][2] === b[1][1] && b[0][2] === b[2][0]) return true;
        return false;
    }

    function checkDraw() {
        return gameBoard.flat().every(cell => cell !== "");
    }

    return {
        initializePlayers,
        getCurrentPlayer,
        switchPlayer,
        getBoard,
        makeMove,
        checkWinner,
        checkDraw,
    };
})();


// === View ===
const View = (() => {
    const boardElement = document.getElementById("gameBoard");
    const messageElement = document.getElementById("message");
    const restartButton = document.getElementById("restartGame");

    function renderBoard(onClick) {
        boardElement.innerHTML = "";

        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                const cell = document.createElement("div");
                cell.classList.add("cell");
                cell.dataset.row = row;
                cell.dataset.col = col;
                cell.addEventListener("click", () => onClick(row, col));
                boardElement.appendChild(cell);
            }
        }
    }

    function updateCell(row, col, symbol) {
        const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
        if (cell) {
            cell.textContent = symbol;
        }
    }

    function displayMessage(msg) {
        messageElement.textContent = msg;
    }

    function showRestartButton() {
        restartButton.classList.remove("hidden");
        restartButton.onclick = () => location.reload();
    }

    function disableBoard() {
        document.querySelectorAll(".cell").forEach(cell => {
            cell.style.pointerEvents = "none";
        });
    }

    return {
        renderBoard,
        updateCell,
        displayMessage,
        showRestartButton,
        disableBoard,
    };
})();


// === Controller ===
const Controller = (() => {
    function startGame() {
        const name1 = document.getElementById("player1Name").value.trim();
        const name2 = document.getElementById("player2Name").value.trim();

        if (!name1 || !name2) {
            alert("Пожалуйста, введите имена обоих игроков.");
            return;
        }

        Model.initializePlayers(name1, name2);
        document.getElementById("playerNames").classList.add("hidden");

        View.renderBoard(handleCellClick);
    }

    function handleCellClick(row, col) {
        if (!Model.makeMove(row, col)) {
            alert("Эта ячейка уже занята.");
            return;
        }

        const player = Model.getCurrentPlayer();
        View.updateCell(row, col, player.symbol);

        if (Model.checkWinner()) {
            View.displayMessage(`Победил ${player.name}! 🎉`);
            View.disableBoard();
            View.showRestartButton();
            return;
        }

        if (Model.checkDraw()) {
            View.displayMessage("Ничья!");
            View.disableBoard();
            View.showRestartButton();
            return;
        }

        Model.switchPlayer();
    }

    return {
        startGame,
    };
})();

// === Init ===
document.getElementById("startGame").addEventListener("click", Controller.startGame);
