class Game {
  private circles: number[][] = [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
  ];

  private previousFirstPlayer: number = 0;

  private score = {
    1: 0,
    2: 0,
  }; // TODO: scores

  private playerTurn: number = 1;

  private interval: number = 0;

  private winner: number = 0;

  changeTurn = (): void => {
    this.playerTurn = this.playerTurn == 1 ? 2 : 1;
    this.changeTurnInDOM();
  };

  changeTurnInDOM() {
    const timerAndTurn = document.querySelector(
      ".timer-and-turn"
    ) as HTMLDivElement;
    timerAndTurn.classList.remove("player-1", "player-2");
    timerAndTurn.classList.add(this.playerTurn == 1 ? "player-1" : "player-2");
    const turn = document.querySelector(".turn") as HTMLParagraphElement;
    turn.textContent =
      this.playerTurn == 1 ? "PLAYER 1'S TURN" : "PLAYER 2'S TURN";
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

  restart() {
    this.winner = 0;

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

    this.playerTurn =
      this.previousFirstPlayer == 0 || this.previousFirstPlayer == 1 ? 2 : 1;

    this.previousFirstPlayer = this.playerTurn == 1 ? 2 : 1;

    // BUG: turn not switching on restart if it is 2nd player's turn that is first

    this.changeTurnInDOM();
    this.setTimeLeftInDOM();

    this.timer();
  }
}

const game: Game = new Game();

const cols: NodeListOf<HTMLDivElement> = document.querySelectorAll(".col");

let winner: number;

game.timer();

cols.forEach((col) => {
  col.addEventListener("click", () => {
    const colNum: number = Number(col.classList[1].substring(4, 5));
    const availableRow = game.getAvailableRow(colNum);
    if (availableRow != -1) {
      // console.log(availableRow, colNum);
      game.setCircle(availableRow, colNum);
      game.changeTurn();
      game.timer();
      winner = game.checkWinner(availableRow, colNum);
      // console.log("\n\n", winner, "\n\n");
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
// const menu = document.querySelector(".menu");

menuBtn?.addEventListener("click", () => {
  if (menuOpen == false) {
    menuContainer?.classList.add("opened");
    // menu?.classList.add("opened");
    menuOpen = true;
  }
});

menuContainer?.addEventListener("click", (e) => {
  const { classList } = e.target as HTMLElement;
  if (
    (classList.contains("menu-container") || classList.contains("logo")) &&
    menuOpen == true
  ) {
    menuContainer?.classList.remove("opened");
    // menu?.classList.remove("opened");
    menuOpen = false;
  }
});

const restartBtn = document.querySelector(".restart-btn");
restartBtn?.addEventListener("click", () => game.restart());

// TODO: check if whole board is filled
// TODO: different modes
