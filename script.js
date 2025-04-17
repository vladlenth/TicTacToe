// Model 
const Model = (() => {
    let player1 = null;
    let player2 = null;
    let currentPlayer = null;

    let gameBoard = [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""],
    ];

    //createPlayer(name, symbol): создаёт объект игрока с именем и символом.
    function createPlayer(name, symbol) { 
        return { name, symbol };
    }


    //initializePlayers(name1, name2): инициализирует двух игроков и очищает игровое поле.
    function initializePlayers(name1, name2) {
        player1 = createPlayer(name1, "X");
        player2 = createPlayer(name2, "O");
        currentPlayer = player1;
        resetBoard();
    }


    // resetBoard(): сбрасывает игровое поле.
    function resetBoard() {
        gameBoard = [["", "", ""], ["", "", ""], ["", "", ""]];
    }


    //getBoard(): возвращает текущее состояние поля.
    function getBoard() {
        return gameBoard;
    }


    //getCurrentPlayer(): возвращает текущего игрока.
    function getCurrentPlayer() {
        return currentPlayer;
    }


    //switchPlayer(): меняет текущего игрока.
    function switchPlayer() {
        currentPlayer = currentPlayer === player1 ? player2 : player1;
    }


    //makeMove(row, col): делает ход, если ячейка пуста.
    function makeMove(row, col) {
        if (gameBoard[row][col] === "") {
            gameBoard[row][col] = currentPlayer.symbol;
            return true;
        }
        return false;
    }


    //checkWinner(): проверяет наличие победителя.
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


    //checkDraw(): проверяет ничью.
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






// View 
const View = (() => {
    const boardElement = document.getElementById("gameBoard");
    const messageElement = document.getElementById("message");
    const restartButton = document.getElementById("restartGame");


    //renderBoard(onClick): отрисовывает игровое поле и назначает обработчик клика.
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


    //updateCell(row, col, symbol): обновляет содержимое ячейки.
    function updateCell(row, col, symbol) {
        const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
        if (cell) {
            cell.textContent = symbol;
        }
    }


    //displayMessage(msg): выводит сообщение.
    function displayMessage(msg) {
        messageElement.textContent = msg;
    }


    //showRestartButton(): отображает кнопку перезапуска.
    function showRestartButton() {
        restartButton.classList.remove("hidden");
        restartButton.onclick = () => location.reload();
    }


    //disableBoard(): блокирует доску от дальнейших кликов.
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






// Controller 
const Controller = (() => {

    //startGame(): инициализирует игру, создаёт игроков и скрывает форму ввода.
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

    //handleCellClick(row, col): обрабатывает клик по ячейке, делает ход и проверяет состояние игры.
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

// Init 
document.getElementById("startGame").addEventListener("click", Controller.startGame);
