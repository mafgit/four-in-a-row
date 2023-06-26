type gameModeType = "" | "vs player" | "vs cpu";

class Game {
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

  setCircle(row: number, col: number): void {
    this.circles[row][col] = this.playerTurn;
    this.setCircleInDOM(row, col);
    this.checkWinner(row, col);
    if (this.winner == 0) this.changeTurn();
  }

  setCircleInDOM(row: number, col: number) {
    const circle: HTMLDivElement = document.querySelector(
      `.circle-${row}-${col}`
    ) as HTMLDivElement;

    circle.classList.add(this.playerTurn == 1 ? "player-1" : "player-2");
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
    console.log("asd");

    let timeout = setTimeout(() => {
      while (this.playerTurn == this.CPUPlayer) {
        // let x = Math.floor(Math.random() * 6);
        let y = Math.floor(Math.random() * 7);
        let x = this.getAvailableRow(y);
        this.setCircle(x, y);
      }

      clearTimeout(timeout);
    }, 2000);
  }

  start(gameMode: gameModeType) {
    this.gameMode = gameMode;
    this.winner = 0;

    if (gameMode == "vs cpu") {
      this.CPUPlayer = Math.floor(Math.random() * 2) + 1;
      if (this.playerTurn == this.CPUPlayer) this.runCPUTurn();

      document.querySelector(
        `.player-${this.CPUPlayer}-score .player-number`
      )!.textContent = "CPU";

      document.querySelector(
        `.player-${this.CPUPlayer == 1 ? 2 : 1}-score .player-number`
      )!.textContent = "YOU";
    }

    for (let i = 0; i <= 5; i++) {
      for (let j = 0; j <= 6; j++) {
        this.circles[i][j] = 0;

        const circle: HTMLDivElement = document.querySelector(
          `.circle-${i}-${j}`
        ) as HTMLDivElement;

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

const menuOpt1 = menuContainer?.querySelector(".menu-opt-1");
const menuOpt2 = menuContainer?.querySelector(".menu-opt-2");
const menuOpt3 = menuContainer?.querySelector(".menu-opt-3");

menuOpt1?.addEventListener("click", () => {
  game.start("vs cpu");
  closeMenu();
});

menuOpt2?.addEventListener("click", () => {
  game.start("vs player");
  closeMenu();
});

menuOpt3?.addEventListener("click", () => {
  // TODO: show game rules
});

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

const restartBtn = document.querySelector(".restart-btn");
restartBtn?.addEventListener("click", () => game.start(game.getGameMode()));

// TODO: check if whole board is filled

// CLICKING A COLUMN
let winner: number = 0;
const cols: NodeListOf<HTMLDivElement> = document.querySelectorAll(".col");
cols.forEach((col) => {
  col.addEventListener("click", () => {
    if (game.getPlayerTurn() === game.getCPUPlayer()) return;
    const colNum: number = Number(col.classList[1].substring(4, 5));
    const availableRow = game.getAvailableRow(colNum);
    if (availableRow != -1) {
      game.setCircle(availableRow, colNum);
      winner = game.getWinner();
      if (winner != 0) {
        console.log(winner);
        // TODO: show winner
        game.start(game.getGameMode());
      }
    }
  });
});
