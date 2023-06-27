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
            YOU: 0,
            CPU: 0,
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
    openAlertInDOM(tied = false) {
        let alertString = "";
        if (tied)
            alertString = "GAME TIED!";
        else {
            if (this.gameMode === "vs cpu") {
                if (this.winner === this.CPUPlayer)
                    alertString = "CPU WON!";
                else
                    alertString = "YOU WON!";
            }
            else {
                alertString = `PLAYER ${this.winner} WON!`;
            }
        }
        const alertContainer = document.querySelector(".alert-container");
        alertContainer.classList.add("opened");
        alertContainer.querySelector("h3").textContent = alertString;
    }
    setCircle(col) {
        if (game.getGameMode() === "")
            return;
        const availableRow = game.getAvailableRow(col);
        if (availableRow == -1)
            return;
        this.circles[availableRow][col] = this.playerTurn;
        this.checkWinner(availableRow, col);
        this.setCircleInDOM(availableRow, col);
        this.filledCircles++;
        if (this.winner === 0)
            this.changeTurn();
        else {
            this.openAlertInDOM();
            game.start();
        }
        if (this.filledCircles === 42 && this.winner === 0) {
            this.openAlertInDOM(true);
            game.start();
        }
    }
    setCircleInDOM(row, col) {
        var _a;
        const circle = document.createElement("div");
        circle.classList.add("circle", "anim-circle", `circle-row-${row}`, this.playerTurn === 1 ? "player-1" : "player-2");
        circle.style.animation = `circle-to-${row} 0.3s ease forwards`;
        (_a = document.querySelector(`.col-${col}`)) === null || _a === void 0 ? void 0 : _a.appendChild(circle);
        if (this.winner != 0) {
            this.openAlertInDOM();
            game.start();
        }
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
    start(gameMode = this.gameMode) {
        this.gameMode = gameMode;
        this.winner = 0;
        if (gameMode === "vs cpu") {
            this.CPUPlayer = Math.floor(Math.random() * 2) + 1;
            if (this.playerTurn == this.CPUPlayer)
                this.runCPUTurn();
            document.querySelector(`.player-${this.CPUPlayer}-score .player-number`).textContent = "CPU";
            document.querySelector(`.player-${this.CPUPlayer == 1 ? 2 : 1}-score .player-number`).textContent = "YOU";
        }
        else {
            this.CPUPlayer = 0;
            document.querySelector(`.player-1-score .player-number`).textContent =
                "PLAYER 1";
            document.querySelector(`.player-2-score .player-number`).textContent =
                "PLAYER 2";
        }
        for (let i = 0; i <= 5; i++) {
            for (let j = 0; j <= 6; j++) {
                this.circles[i][j] = 0;
                const animCircles = document.querySelectorAll(".anim-circle");
                animCircles.forEach((animCircle) => {
                    animCircle.remove();
                });
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
const alertContainer = document.querySelector(".alert-container");
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
const closeAlert = () => {
    alertContainer === null || alertContainer === void 0 ? void 0 : alertContainer.classList.remove("opened");
};
const popupRestartBtn = menuContainer === null || menuContainer === void 0 ? void 0 : menuContainer.querySelector(".popup-restart-btn");
const popupVSCPUBtn = menuContainer === null || menuContainer === void 0 ? void 0 : menuContainer.querySelector(".popup-vs-cpu-btn");
const popupVSPlayerBtn = menuContainer === null || menuContainer === void 0 ? void 0 : menuContainer.querySelector(".popup-vs-player-btn");
const popupGameRulesBtn = menuContainer === null || menuContainer === void 0 ? void 0 : menuContainer.querySelector(".popup-game-rules-btn");
popupRestartBtn === null || popupRestartBtn === void 0 ? void 0 : popupRestartBtn.addEventListener("click", () => {
    game.start("vs cpu");
    closeMenu();
});
popupVSCPUBtn === null || popupVSCPUBtn === void 0 ? void 0 : popupVSCPUBtn.addEventListener("click", () => {
    game.start("vs cpu");
    closeMenu();
});
popupVSPlayerBtn === null || popupVSPlayerBtn === void 0 ? void 0 : popupVSPlayerBtn.addEventListener("click", () => {
    game.start("vs player");
    closeMenu();
});
const popupContainers = document.querySelectorAll(".popup-container");
menuContainer === null || menuContainer === void 0 ? void 0 : menuContainer.addEventListener("click", (e) => {
    if (game.getGameMode() === "")
        return;
    const { classList } = e.target;
    if ((classList.contains("menu-container") || classList.contains("logo")) &&
        menuOpen == true) {
        closeMenu();
    }
});
alertContainer === null || alertContainer === void 0 ? void 0 : alertContainer.addEventListener("click", (e) => {
    if (!e.target.classList.contains("popup"))
        closeAlert();
});
const restartBtn = document.querySelector(".restart-btn");
restartBtn === null || restartBtn === void 0 ? void 0 : restartBtn.addEventListener("click", () => game.start());
const cols = document.querySelectorAll(".col");
cols.forEach((col) => {
    col.addEventListener("click", () => {
        if (game.getPlayerTurn() === game.getCPUPlayer())
            return;
        const colNum = Number(col.classList[1].substring(4, 5));
        game.setCircle(colNum);
    });
});
