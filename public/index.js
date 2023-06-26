"use strict";
class Game {
    constructor() {
        this.circles = [
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
        ];
        this.previousFirstPlayer = 0;
        this.score = {
            1: 0,
            2: 0,
        };
        this.playerTurn = 1;
        this.interval = 0;
        this.winner = 0;
        this.changeTurn = () => {
            this.playerTurn = this.playerTurn == 1 ? 2 : 1;
            this.changeTurnInDOM();
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
        turn.textContent =
            this.playerTurn == 1 ? "PLAYER 1'S TURN" : "PLAYER 2'S TURN";
    }
    setCircle(row, col) {
        this.circles[row][col] = this.playerTurn;
        this.setCircleInDOM(row, col);
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
    restart() {
        this.winner = 0;
        for (let i = 0; i <= 5; i++) {
            for (let j = 0; j <= 6; j++) {
                this.circles[i][j] = 0;
                const circle = document.querySelector(`.circle-${i}-${j}`);
                circle.classList.remove("player-1", "player-2");
            }
        }
        clearInterval(this.interval);
        this.playerTurn =
            this.previousFirstPlayer == 0 || this.previousFirstPlayer == 1 ? 2 : 1;
        this.previousFirstPlayer = this.playerTurn == 1 ? 2 : 1;
        this.changeTurnInDOM();
        this.setTimeLeftInDOM();
        this.timer();
    }
}
const game = new Game();
const cols = document.querySelectorAll(".col");
let winner;
game.timer();
cols.forEach((col) => {
    col.addEventListener("click", () => {
        const colNum = Number(col.classList[1].substring(4, 5));
        const availableRow = game.getAvailableRow(colNum);
        if (availableRow != -1) {
            game.setCircle(availableRow, colNum);
            game.changeTurn();
            game.timer();
            winner = game.checkWinner(availableRow, colNum);
            if (winner != 0) {
                console.log(winner);
                game.restart();
            }
        }
    });
});
let menuOpen = false;
const menuBtn = document.querySelector(".menu-btn");
const menuContainer = document.querySelector(".menu-container");
menuBtn === null || menuBtn === void 0 ? void 0 : menuBtn.addEventListener("click", () => {
    if (menuOpen == false) {
        menuContainer === null || menuContainer === void 0 ? void 0 : menuContainer.classList.add("opened");
        menuOpen = true;
    }
});
menuContainer === null || menuContainer === void 0 ? void 0 : menuContainer.addEventListener("click", (e) => {
    const { classList } = e.target;
    if ((classList.contains("menu-container") || classList.contains("logo")) &&
        menuOpen == true) {
        menuContainer === null || menuContainer === void 0 ? void 0 : menuContainer.classList.remove("opened");
        menuOpen = false;
    }
});
const restartBtn = document.querySelector(".restart-btn");
restartBtn === null || restartBtn === void 0 ? void 0 : restartBtn.addEventListener("click", () => game.restart());
