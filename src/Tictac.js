const cells = document.querySelectorAll(".cell");
const currentTurnEl = document.querySelector(".current-turn");
const symbolIcons = document.querySelectorAll(".symbols i");
const resetBtn = document.querySelector(".reset .button");
const overlay = document.getElementById("overylay");
const messageContent = document.querySelector("#massage .content");
const closeBtn = document.getElementById("close");
const score1El = document.querySelector(".score1");
const score2El = document.querySelector(".score2");
const drawEl = document.querySelector(".drew");

const ICONS = {
    x: '<i class="fa-solid fa-xmark"></i>',
    o: '<i class="fa-regular fa-circle"></i>',
};

const WIN_LINES = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6],            // diagonals
];

let board = Array(9).fill(null);
let turn = "x";
let startingPlayer = "x";
let gameOver = false;
let scores = { x: 0, o: 0, draw: 0 };

function updateTurnUI() {
    currentTurnEl.innerHTML = ICONS[turn];
    currentTurnEl.style.color = turn === "x" ? "var(--x)" : "var(--o)";
    symbolIcons[0].classList.toggle("active", turn === "x");
    symbolIcons[1].classList.toggle("active", turn === "o");
}

function showMessage(html) {
    messageContent.innerHTML = html;
    overlay.classList.add("show");
}

function hideMessage() {
    overlay.classList.remove("show");
}

function checkWinner() {
    for (const line of WIN_LINES) {
        const [a, b, c] = line;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return { winner: board[a], line };
        }
    }
    return null;
}

function handleCellClick(index) {
    if (gameOver || board[index]) return;

    board[index] = turn;
    const cell = cells[index];
    cell.innerHTML = ICONS[turn];
    cell.classList.add("taken", turn);

    const result = checkWinner();

    if (result) {
        gameOver = true;
        result.line.forEach((i) => cells[i].classList.add("win"));
        scores[result.winner]++;
        score1El.textContent = scores.x;
        score2El.textContent = scores.o;
        const name = result.winner === "x" ? "Player 1" : "Player 2";
        setTimeout(() => showMessage(`${ICONS[result.winner]} ${name} wins!`), 500);
        return;
    }

    if (board.every(Boolean)) {
        gameOver = true;
        scores.draw++;
        drawEl.textContent = scores.draw;
        setTimeout(() => showMessage("It's a draw!"), 400);
        return;
    }

    turn = turn === "x" ? "o" : "x";
    updateTurnUI();
}

function newRound() {
    board = Array(9).fill(null);
    gameOver = false;
    startingPlayer = startingPlayer === "x" ? "o" : "x";
    turn = startingPlayer;
    cells.forEach((cell) => {
        cell.innerHTML = "";
        cell.className = "cell";
    });
    updateTurnUI();
}

function resetAll() {
    scores = { x: 0, o: 0, draw: 0 };
    score1El.textContent = 0;
    score2El.textContent = 0;
    drawEl.textContent = 0;
    startingPlayer = "o"; // newRound() flips it back to "x"
    newRound();
}

cells.forEach((cell, index) => {
    cell.addEventListener("click", () => handleCellClick(index));
});

closeBtn.addEventListener("click", () => {
    hideMessage();
    newRound();
});

overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
        hideMessage();
        newRound();
    }
});

resetBtn.addEventListener("click", () => {
    hideMessage();
    resetAll();
});

updateTurnUI();