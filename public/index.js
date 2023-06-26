"use strict";
class Game {
    constructor() {
        this.filledCircles = 0;
        this.circles = [
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
        ];
        this.firstPlayer = 2;
        this.score = {
            1: 0,
            2: 0,
        };
        this.playerTurn = 1;
        this.CPUPlayer = 0;
        this.gameMode = "";
        this.interval = 0;
        this.winner = 0;
        this.changeTurn = () => {
            if (this.playerTurn != this.CPUPlayer && this.gameMode == "vs cpu") {
                this.runCPUTurn();
            }
            this.playerTurn = this.playerTurn === 1 ? 2 : 1;
            this.changeTurnInDOM();
            this.timer();
        };
        this.getAvailableRow = (colNum) => {
            const valid = this.circles[0][colNum] == 0;
            if (valid)
                for (let i = 5; i >= 0; i--) {
                    if (this.circles[i][colNum] == 0) {
                        return i;
                    }
                }
            return -1;
        };
    }
    changeTurnInDOM() {
        const timerAndTurn = document.querySelector(".timer-and-turn");
        timerAndTurn.classList.remove("player-1", "player-2");
        timerAndTurn.classList.add(this.playerTurn == 1 ? "player-1" : "player-2");
        const turn = document.querySelector(".turn");
        if (this.gameMode == "vs player")
            turn.textContent =
                this.playerTurn == 1 ? "PLAYER 1'S TURN" : "PLAYER 2'S TURN";
        else
            turn.textContent =
                this.playerTurn == this.CPUPlayer ? "CPU'S TURN" : "YOUR TURN";
    }
    setCircle(col) {
        const availableRow = game.getAvailableRow(col);
        if (availableRow == -1)
            return;
        this.circles[availableRow][col] = this.playerTurn;
        this.setCircleInDOM(availableRow, col);
        this.filledCircles++;
        this.checkWinner(availableRow, col);
        if (this.winner == 0)
            this.changeTurn();
        if (this.filledCircles == 42 && this.winner == 0) {
            alert("Game tied");
            game.start(this.gameMode);
        }
    }
    setCircleInDOM(row, col) {
        const circle = document.querySelector(`.circle-${row}-${col}`);
        circle.classList.add(this.playerTurn == 1 ? "player-1" : "player-2");
    }
    setTimeLeftInDOM(timeLeft = 29) {
        const timeLeftElement = document.querySelector(".time-left");
        timeLeftElement.textContent = String(timeLeft) + "s";
    }
    timer(on = true, timeLeft = 29) {
        clearInterval(this.interval);
        if (on) {
            this.setTimeLeftInDOM(timeLeft);
            this.interval = setInterval(() => {
                this.setTimeLeftInDOM(timeLeft);
                timeLeft--;
                if (timeLeft == -1) {
                    clearInterval(this.interval);
                    this.timer();
                    return this.changeTurn();
                }
            }, 1000);
        }
    }
    checkWinner(row, col) {
        let selected = this.circles[row][col];
        if (selected == 0)
            return 0;
        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < 7; j++) {
                let current = this.circles[i][j];
                if (i <= 2) {
                    if (current != selected)
                        continue;
                    this.winner = selected;
                    for (let x = i; x <= i + 3; x++) {
                        if (this.circles[x][j] != selected) {
                            this.winner = 0;
                            break;
                        }
                    }
                    if (this.winner != 0)
                        return this.winner;
                }
                if (j <= 3) {
                    if (current != selected)
                        continue;
                    this.winner = selected;
                    for (let y = j; y <= j + 3; y++) {
                        if (this.circles[i][y] != selected) {
                            this.winner = 0;
                            break;
                        }
                    }
                    if (this.winner != 0)
                        return this.winner;
                }
                if (i <= 2 && j <= 3) {
                    if (current != selected)
                        continue;
                    for (let x = i, y = j; x <= i + 3 && y <= j + 3; x++, y++) {
                        this.winner = selected;
                        if (this.circles[x][y] != selected) {
                            this.winner = 0;
                            break;
                        }
                    }
                    if (this.winner != 0)
                        return this.winner;
                }
                if (i <= 2 && j >= 3) {
                    if (current != selected)
                        continue;
                    for (let x = i, y = j; x <= i + 3 && y >= j - 3; x++, y--) {
                        this.winner = selected;
                        if (this.circles[x][y] != selected) {
                            this.winner = 0;
                            break;
                        }
                    }
                    if (this.winner != 0)
                        return this.winner;
                }
            }
        }
        return 0;
    }
    runCPUTurn() {
        let filledCircles = this.filledCircles;
        let timeout = setTimeout(() => {
            while (this.filledCircles == filledCircles) {
                let col = Math.floor(Math.random() * 7);
                this.setCircle(col);
            }
            clearTimeout(timeout);
        }, 2000);
    }
    start(gameMode) {
        this.gameMode = gameMode;
        this.winner = 0;
        if (gameMode == "vs cpu") {
            this.CPUPlayer = Math.floor(Math.random() * 2) + 1;
            if (this.playerTurn == this.CPUPlayer)
                this.runCPUTurn();
            document.querySelector(`.player-${this.CPUPlayer}-score .player-number`).textContent = "CPU";
            document.querySelector(`.player-${this.CPUPlayer == 1 ? 2 : 1}-score .player-number`).textContent = "YOU";
        }
        for (let i = 0; i <= 5; i++) {
            for (let j = 0; j <= 6; j++) {
                this.circles[i][j] = 0;
                const circle = document.querySelector(`.circle-${i}-${j}`);
                circle.classList.remove("player-1", "player-2");
            }
        }
        clearInterval(this.interval);
        this.firstPlayer = this.firstPlayer === 1 ? 2 : 1;
        this.playerTurn = this.firstPlayer;
        this.changeTurnInDOM();
        this.setTimeLeftInDOM();
        this.timer();
    }
    getGameMode() {
        return this.gameMode;
    }
    getCPUPlayer() {
        return this.CPUPlayer;
    }
    getPlayerTurn() {
        return this.playerTurn;
    }
    getWinner() {
        return this.winner;
    }
}
const game = new Game();
let menuOpen = true;
const menuBtn = document.querySelector(".menu-btn");
const menuContainer = document.querySelector(".menu-container");
menuBtn === null || menuBtn === void 0 ? void 0 : menuBtn.addEventListener("click", () => {
    if (menuOpen == false) {
        menuContainer === null || menuContainer === void 0 ? void 0 : menuContainer.classList.add("opened");
        menuOpen = true;
    }
});
const closeMenu = () => {
    menuContainer === null || menuContainer === void 0 ? void 0 : menuContainer.classList.remove("opened");
    menuOpen = false;
};
const menuOpt1 = menuContainer === null || menuContainer === void 0 ? void 0 : menuContainer.querySelector(".menu-opt-1");
const menuOpt2 = menuContainer === null || menuContainer === void 0 ? void 0 : menuContainer.querySelector(".menu-opt-2");
const menuOpt3 = menuContainer === null || menuContainer === void 0 ? void 0 : menuContainer.querySelector(".menu-opt-3");
menuOpt1 === null || menuOpt1 === void 0 ? void 0 : menuOpt1.addEventListener("click", () => {
    game.start("vs cpu");
    closeMenu();
});
menuOpt2 === null || menuOpt2 === void 0 ? void 0 : menuOpt2.addEventListener("click", () => {
    game.start("vs player");
    closeMenu();
});
menuOpt2 === null || menuOpt2 === void 0 ? void 0 : menuOpt2.addEventListener("click", () => { });
menuContainer === null || menuContainer === void 0 ? void 0 : menuContainer.addEventListener("click", (e) => {
    if (game.getGameMode() === "")
        return;
    const { classList } = e.target;
    if ((classList.contains("menu-container") || classList.contains("logo")) &&
        menuOpen == true) {
        closeMenu();
    }
});
const restartBtn = document.querySelector(".restart-btn");
restartBtn === null || restartBtn === void 0 ? void 0 : restartBtn.addEventListener("click", () => game.start(game.getGameMode()));
let winner = 0;
const cols = document.querySelectorAll(".col");
cols.forEach((col) => {
    col.addEventListener("click", () => {
        if (game.getPlayerTurn() === game.getCPUPlayer())
            return;
        const colNum = Number(col.classList[1].substring(4, 5));
        game.setCircle(colNum);
        winner = game.getWinner();
        if (winner != 0) {
            alert(`Player-${winner} won the game`);
            game.start(game.getGameMode());
        }
    });
});
