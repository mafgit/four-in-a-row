type gameModeType = "" | "vs player" | "vs cpu";

class Game {
  private filledCircles: number = 0; // max 42

  private circles: number[][] = [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
  ];

  private firstPlayer: number = 2;

  private score = {
    1: 0,
    2: 0,
    YOU: 0,
    CPU: 0,
  }; // TODO: update scores

  private playerTurn: number = 1;

  private CPUPlayer: number = 0;

  private gameMode: gameModeType = "";

  private interval: number = 0;

  private winner: number = 0;

  changeTurn = (): void => {
    if (this.playerTurn != this.CPUPlayer && this.gameMode == "vs cpu") {
      this.runCPUTurn();
    }

    this.playerTurn = this.playerTurn === 1 ? 2 : 1;
    this.changeTurnInDOM();
    this.timer();
  };

  changeTurnInDOM() {
    const timerAndTurn = document.querySelector(
      ".timer-and-turn"
    ) as HTMLDivElement;
    timerAndTurn.classList.remove("player-1", "player-2");
    timerAndTurn.classList.add(this.playerTurn == 1 ? "player-1" : "player-2");
    const turn = document.querySelector(".turn") as HTMLParagraphElement;
    if (this.gameMode == "vs player")
      turn.textContent =
        this.playerTurn == 1 ? "PLAYER 1'S TURN" : "PLAYER 2'S TURN";
    else
      turn.textContent =
        this.playerTurn == this.CPUPlayer ? "CPU'S TURN" : "YOUR TURN";
  }

  getAvailableRow = (colNum: number): number => {
    const valid = this.circles[0][colNum] == 0;

    if (valid)
      for (let i = 5; i >= 0; i--) {
        if (this.circles[i][colNum] == 0) {
          return i;
        }
      }

    return -1;
  };

  openAlertInDOM(tied: boolean = false) {
    let alertString: string = "";
    if (tied) alertString = "GAME TIED!";
    else {
      if (this.gameMode === "vs cpu") {
        if (this.winner === this.CPUPlayer) alertString = "CPU WON!";
        else alertString = "YOU WON!";
      } else {
        alertString = `PLAYER ${this.winner} WON!`;
      }
    }

    const alertContainer = document.querySelector(".alert-container")!;
    alertContainer.classList.add("opened");
    alertContainer.querySelector("h3")!.textContent = alertString;
  }

  setCircle(col: number): void {
    if (game.getGameMode() === "") return;

    const availableRow = game.getAvailableRow(col);
    if (availableRow == -1) return;

    this.circles[availableRow][col] = this.playerTurn;
    this.checkWinner(availableRow, col);
    this.setCircleInDOM(availableRow, col);
    this.filledCircles++;

    if (this.winner === 0) this.changeTurn();
    else {
      this.openAlertInDOM();
      game.start();
    }

    if (this.filledCircles === 42 && this.winner === 0) {
      this.openAlertInDOM(true);
      game.start();
    }
  }

  setCircleInDOM(row: number, col: number) {
    const circle = document.createElement("div");

    circle.classList.add(
      "circle",
      "anim-circle",
      `circle-row-${row}`,
      this.playerTurn === 1 ? "player-1" : "player-2"
    );

    circle.style.animation = `circle-to-${row} 0.3s ease forwards`;
    document.querySelector(`.col-${col}`)?.appendChild(circle);

    if (this.winner != 0) {
      this.openAlertInDOM();
      game.start();
    }
  }

  setTimeLeftInDOM(timeLeft: number = 29): void {
    const timeLeftElement = document.querySelector(".time-left") as HTMLElement;
    timeLeftElement.textContent = String(timeLeft) + "s";
  }

  timer(on: boolean = true, timeLeft: number = 29) {
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

  checkWinner(row: number, col: number): number {
    // console.clear();
    // for (let i = 0; i < 7; i++) {
    //   for (let j = 0; j < 6; j++) {
    //     console.log(this.circleCols[i][j]);
    //   }
    // }

    // [0, 0, 0, 0, 0, 0, 0],
    // [0, 0, 0, 0, 0, 0, 0],
    // [0, 0, 0, 0, 0, 0, 0],
    // [0, 0, 0, 0, 0, 0, 0],
    // [0, 0, 0, 0, 0, 0, 0],
    // [0, 0, 0, 0, 0, 0, 0],

    let selected = this.circles[row][col];
    if (selected == 0) return 0;

    // TODO: keep track of circles and give a style to them

    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 7; j++) {
        let current = this.circles[i][j];

        // down in col
        if (i <= 2) {
          if (current != selected) continue;
          this.winner = selected;
          for (let x = i; x <= i + 3; x++) {
            if (this.circles[x][j] != selected) {
              this.winner = 0;
              break;
            }
          }

          if (this.winner != 0) return this.winner;
        }

        // right in row
        if (j <= 3) {
          if (current != selected) continue;
          this.winner = selected;
          for (let y = j; y <= j + 3; y++) {
            if (this.circles[i][y] != selected) {
              this.winner = 0;
              break;
            }
          }

          if (this.winner != 0) return this.winner;
        }

        // diagonally right and down
        if (i <= 2 && j <= 3) {
          if (current != selected) continue;

          // const c: NodeListOf<HTMLElement> =
          //   document.querySelectorAll(".circle");
          // c.forEach((b) => (b.style.border = "none"));

          for (let x = i, y = j; x <= i + 3 && y <= j + 3; x++, y++) {
            this.winner = selected;

            // const a: HTMLElement = document.querySelector(
            //   `.circle-${x}-${y}`
            // ) as HTMLElement;
            // a.style.border = "2px solid black";

            if (this.circles[x][y] != selected) {
              this.winner = 0;
              break;
            }
          }

          if (this.winner != 0) return this.winner;
        }

        // diagonally left and down
        if (i <= 2 && j >= 3) {
          if (current != selected) continue;

          // const c: NodeListOf<HTMLElement> =
          //   document.querySelectorAll(".circle");
          // c.forEach((b) => (b.style.border = "none"));

          for (let x = i, y = j; x <= i + 3 && y >= j - 3; x++, y--) {
            this.winner = selected;

            // const a: HTMLElement = document.querySelector(
            //   `.circle-${x}-${y}`
            // ) as HTMLElement;
            // a.style.border = "2px solid black";

            if (this.circles[x][y] != selected) {
              this.winner = 0;
              break;
            }
          }

          if (this.winner != 0) return this.winner;
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

  start(gameMode: gameModeType = this.gameMode) {
    this.gameMode = gameMode;
    this.winner = 0;

    if (gameMode === "vs cpu") {
      this.CPUPlayer = Math.floor(Math.random() * 2) + 1;
      if (this.playerTurn == this.CPUPlayer) this.runCPUTurn();

      document.querySelector(
        `.player-${this.CPUPlayer}-score .player-number`
      )!.textContent = "CPU";

      document.querySelector(
        `.player-${this.CPUPlayer == 1 ? 2 : 1}-score .player-number`
      )!.textContent = "YOU";
    } else {
      this.CPUPlayer = 0;

      document.querySelector(`.player-1-score .player-number`)!.textContent =
        "PLAYER 1";

      document.querySelector(`.player-2-score .player-number`)!.textContent =
        "PLAYER 2";
    }

    for (let i = 0; i <= 5; i++) {
      for (let j = 0; j <= 6; j++) {
        this.circles[i][j] = 0;

        // const circle: HTMLDivElement = document.querySelector(
        //   `.circle-${i}-${j}`
        // ) as HTMLDivElement;

        // circle.classList.remove("player-1", "player-2");

        const animCircles: NodeListOf<HTMLDivElement> =
          document.querySelectorAll(".anim-circle");
        animCircles.forEach((animCircle) => {
          // animCircle.style.animation = "none";
          // setTimeout(() => {
          //   animCircle.style.animation = `circle-to-${animCircle.classList[2][11]} 0.3s ease forwards reverse`;
          // }, 1);

          // setTimeout(() => {
          //   animCircle.remove();
          // }, 400);

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

  getGameMode(): gameModeType {
    return this.gameMode;
  }

  getCPUPlayer(): number {
    return this.CPUPlayer;
  }

  getPlayerTurn(): number {
    return this.playerTurn;
  }

  getWinner(): number {
    return this.winner;
  }
}

const game: Game = new Game();

// MENU & RESTART
let menuOpen = true;
const menuBtn = document.querySelector(".menu-btn");
const menuContainer = document.querySelector(".menu-container");
const alertContainer = document.querySelector(".alert-container");

menuBtn?.addEventListener("click", () => {
  if (menuOpen == false) {
    menuContainer?.classList.add("opened");
    menuOpen = true;
  }
});

const closeMenu = () => {
  menuContainer?.classList.remove("opened");
  menuOpen = false;
};

const closeAlert = () => {
  alertContainer?.classList.remove("opened");
};

const popupRestartBtn = menuContainer?.querySelector(".popup-restart-btn");
const popupVSCPUBtn = menuContainer?.querySelector(".popup-vs-cpu-btn");
const popupVSPlayerBtn = menuContainer?.querySelector(".popup-vs-player-btn");
const popupGameRulesBtn = menuContainer?.querySelector(".popup-game-rules-btn");

popupRestartBtn?.addEventListener("click", () => {
  game.start("vs cpu");
  closeMenu();
});

popupVSCPUBtn?.addEventListener("click", () => {
  game.start("vs cpu");
  closeMenu();
});

popupVSPlayerBtn?.addEventListener("click", () => {
  game.start("vs player");
  closeMenu();
});

const popupContainers: NodeListOf<HTMLDivElement> =
  document.querySelectorAll(".popup-container");

menuContainer?.addEventListener("click", (e) => {
  if (game.getGameMode() === "") return;
  const { classList } = e.target as HTMLElement;
  if (
    (classList.contains("menu-container") || classList.contains("logo")) &&
    menuOpen == true
  ) {
    closeMenu();
  }
});

alertContainer?.addEventListener("click", (e) => {
  // TODO: stop timer until alert is closed
  if (!(e.target as HTMLElement).classList.contains("popup")) closeAlert();
});

const restartBtn = document.querySelector(".restart-btn");
restartBtn?.addEventListener("click", () => game.start());

// CLICKING A COLUMN
const cols: NodeListOf<HTMLDivElement> = document.querySelectorAll(".col");
cols.forEach((col) => {
  col.addEventListener("click", () => {
    if (game.getPlayerTurn() === game.getCPUPlayer()) return;
    const colNum: number = Number(col.classList[1].substring(4, 5));
    game.setCircle(colNum);
  });
});
