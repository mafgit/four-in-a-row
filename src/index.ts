import Game from "./Game";

const game: Game = new Game();
game.timer();
let winner: number;

const cols: NodeListOf<HTMLDivElement> = document.querySelectorAll(".col");

// on column click
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

// on restart button click
const restartBtn = document.querySelector(".restart-btn") as HTMLButtonElement;
restartBtn.addEventListener("click", () => game.restart());
