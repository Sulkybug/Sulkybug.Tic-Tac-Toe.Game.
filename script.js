import playSound from './playSound.js';

const x_class = 'x';
const circle_class = 'circle';
const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [6, 4, 2],
];

//const idWinningArray = winningCombinations.map((e) => {
//  return e.map((x) => x + 1);
//}); // to increase by 1 all numbers in 2D array

const cell1 = document.getElementById('1');
const cell2 = document.getElementById('2');
const cell3 = document.getElementById('3');
const cell4 = document.getElementById('4');
const cell5 = document.getElementById('5');
const cell6 = document.getElementById('6');
const cell7 = document.getElementById('7');
const cell8 = document.getElementById('8');
const cell9 = document.getElementById('9');

let cells = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const cellElements = document.querySelectorAll('[data-cell]');
const board = document.getElementById('board');
const winningMessageElement = document.getElementById('winningMessage');
const restartGame = document.getElementById('restartButton');
const winningMessageText = document.querySelector(
  '[data-winning-message-text]'
);
const xScore = document.querySelector('.xScore');
const circleScore = document.querySelector('.circleScore');
let playerXScore = 0;
let playerCircleScore = 0;
let circleTurn;
let P2CP = document.querySelector('.icon2');
const gameMode = document.querySelector('.mode');
let mode = '';
let description = document.querySelector('.description');
let changeDificulty = document.querySelector('.changeDificulty');
let descriptionCp = document.querySelector('.levelCP');
let cpLevel = 'Hard';

gameMode.addEventListener('click', () => {
  playSound('clickSound.mp3');
  if (mode === '' || mode === 'OFF') {
    mode = 'ON';
    P2CP.innerText = 'P2';
    description.innerText = 'Player 1 vs Player 2';
    playerXScore = 0;
    playerCircleScore = 0;
    xScore.textContent = playerXScore;
    circleScore.textContent = playerCircleScore;
    cells = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    descriptionCp.innerText = '';
    changeDificulty.style.display = 'none';
    startGame();
  } else if (mode === 'ON') {
    mode = 'OFF';
    P2CP.innerText = 'CP';
    description.innerText = 'Player vs Computer';
    playerXScore = 0;
    playerCircleScore = 0;
    xScore.textContent = playerXScore;
    circleScore.textContent = playerCircleScore;
    cells = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    descriptionCp.innerText = 'Hard';
    cpLevel = 'Hard';
    descriptionCp.style.color = 'rgb(252, 86, 26)';
    changeDificulty.style.display = 'flex';
    startGame();
  }
});

changeDificulty.addEventListener('click', () => {
  playSound('clickSound.mp3');
  if (cpLevel === 'Hard') {
    cpLevel = 'Normal';
    descriptionCp.innerText = 'Normal';
    descriptionCp.style.color = 'rgb(122, 166, 206';
  } else if (cpLevel === 'Normal') {
    cpLevel = 'Easy';
    descriptionCp.innerText = 'Easy';
    descriptionCp.style.color = 'lawngreen';
  } else {
    cpLevel = 'Hard';
    descriptionCp.innerText = 'Hard';
    descriptionCp.style.color = 'rgb(252, 86, 26)';
  }
});

startGame();

restartGame.addEventListener('click', startGame);

function startGame() {
  circleTurn = false;
  cellElements.forEach((cell) => {
    cell.classList.remove(x_class);
    cell.classList.remove(circle_class);
    cell.removeEventListener('click', handleClick);
    cell.addEventListener('click', handleClick, { once: true });
  });
  setBoardHoverClass();
  winningMessageElement.classList.remove('show');
}

function handleClick(e) {
  playSound('clickSound.mp3');
  const cell = e.target;
  const currentClass = circleTurn ? circle_class : x_class;

  placeMark(cell, currentClass);

  if (checkWin(currentClass)) {
    endGame(false);
  } else if (isDraw()) {
    endGame(true);
  } else {
    swapTurns();
    setBoardHoverClass();
    if (circleTurn) {
      if (mode === '' || mode === 'OFF') {
        cpAnswer();
      }
    }
  }
}

function endGame(draw) {
  cells = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  if (draw) {
    winningMessageText.innerText = 'It is a Draw!';
    playSound('drawSound.mp3');
  } else {
    if (mode === '' || mode === 'OFF') {
      winningMessageText.innerText = `${
        circleTurn ? 'CP ' : 'P1 '
      }is the Winner`;
      if (winningMessageText.innerText === 'CP is the Winner') {
        playSound('LosingSound.mp3');
      } else {
        playSound('WinningSound.mp3');
      }
    } else {
      winningMessageText.innerText = `${
        circleTurn ? 'P2 ' : 'P1 '
      }is the Winner`;
      playSound('WinningSound.mp3');
    }
  }
  winningMessageElement.classList.add('show');

  updateScore();
}

function isDraw() {
  return [...cellElements].every((cell) => {
    return (
      cell.classList.contains(x_class) || cell.classList.contains(circle_class)
    );
  });
}

function placeMark(cell, currentClass) {
  cell.classList.add(currentClass);
  //console.log(typeof parseInt(cell.id)); to make the value into a number
  cells = cells.filter((x) => x !== parseInt(cell.id));
}

function swapTurns() {
  circleTurn = !circleTurn;
}

function setBoardHoverClass() {
  board.classList.remove(x_class);
  board.classList.remove(circle_class);
  if (circleTurn) {
    board.classList.add(circle_class);
  } else {
    board.classList.add(x_class);
  }
}

function checkWin(currentClass) {
  return winningCombinations.some((combinations) => {
    return combinations.every((index) => {
      return cellElements[index].classList.contains(currentClass);
    });
  });
}

function updateScore() {
  if (winningMessageText.innerText === 'It is a Draw!') {
  } else if (winningMessageText.innerText === 'P1 is the Winner') {
    playerXScore += 1;
    xScore.textContent = playerXScore;
  } else {
    playerCircleScore += 1;
    circleScore.textContent = playerCircleScore;
  }
}

//async
export default function cpAnswer() {
  let result = 0;
  //await new Promise((resolve) => {
  //setTimeout(resolve, 2000);
  //});

  if (cpLevel === 'Hard' || cpLevel === 'Normal') {
    if (
      cell9.classList.contains(circle_class) &&
      cell6.classList.contains(circle_class) &&
      !cell3.classList.contains(x_class)
    ) {
      cell3.click();
    } else if (
      cell1.classList.contains(circle_class) &&
      cell2.classList.contains(circle_class) &&
      !cell3.classList.contains(x_class)
    ) {
      cell3.click();
    } else if (
      cell1.classList.contains(circle_class) &&
      cell3.classList.contains(circle_class) &&
      !cell2.classList.contains(x_class)
    ) {
      cell2.click();
    } else if (
      cell1.classList.contains(circle_class) &&
      cell4.classList.contains(circle_class) &&
      !cell7.classList.contains(x_class)
    ) {
      cell7.click();
    } else if (
      cell3.classList.contains(circle_class) &&
      cell5.classList.contains(circle_class) &&
      !cell7.classList.contains(x_class)
    ) {
      cell7.click();
    } else if (
      cell3.classList.contains(circle_class) &&
      cell6.classList.contains(circle_class) &&
      !cell9.classList.contains(x_class)
    ) {
      cell9.click();
    } else if (
      cell4.classList.contains(circle_class) &&
      cell5.classList.contains(circle_class) &&
      !cell6.classList.contains(x_class)
    ) {
      cell6.click();
    } else if (
      cell9.classList.contains(circle_class) &&
      cell8.classList.contains(circle_class) &&
      !cell7.classList.contains(x_class)
    ) {
      cell7.click();
    } else if (
      cell7.classList.contains(circle_class) &&
      cell8.classList.contains(circle_class) &&
      !cell9.classList.contains(x_class)
    ) {
      cell9.click();
    } else if (
      cell3.classList.contains(circle_class) &&
      cell9.classList.contains(circle_class) &&
      !cell6.classList.contains(x_class)
    ) {
      cell6.click();
    } else if (
      cell5.classList.contains(circle_class) &&
      cell6.classList.contains(circle_class) &&
      !cell4.classList.contains(x_class)
    ) {
      cell4.click();
    } else if (
      cell2.classList.contains(circle_class) &&
      cell5.classList.contains(circle_class) &&
      !cell8.classList.contains(x_class)
    ) {
      cell8.click();
    } else if (
      cell8.classList.contains(circle_class) &&
      cell5.classList.contains(circle_class) &&
      !cell2.classList.contains(x_class)
    ) {
      cell2.click();
    } else if (
      cell7.classList.contains(circle_class) &&
      cell4.classList.contains(circle_class) &&
      !cell1.classList.contains(x_class)
    ) {
      cell1.click();
    } else if (
      cell7.classList.contains(circle_class) &&
      cell5.classList.contains(circle_class) &&
      !cell3.classList.contains(x_class)
    ) {
      cell3.click();
    } else if (
      cell7.classList.contains(circle_class) &&
      cell9.classList.contains(circle_class) &&
      !cell8.classList.contains(x_class)
    ) {
      cell8.click();
    } else if (
      cell1.classList.contains(x_class) &&
      cell9.classList.contains(x_class) &&
      !cell5.classList.contains(circle_class)
    ) {
      cell5.click();
    } else if (
      cell3.classList.contains(x_class) &&
      cell7.classList.contains(x_class) &&
      !cell5.classList.contains(circle_class)
    ) {
      cell5.click();
    } else if (
      cell1.classList.contains(x_class) &&
      cell3.classList.contains(x_class) &&
      !cell2.classList.contains(circle_class)
    ) {
      cell2.click();
    } else if (
      cell4.classList.contains(x_class) &&
      cell6.classList.contains(x_class) &&
      !cell5.classList.contains(circle_class)
    ) {
      cell5.click();
    } else if (
      cell7.classList.contains(x_class) &&
      cell9.classList.contains(x_class) &&
      !cell8.classList.contains(circle_class)
    ) {
      cell8.click();
    } else if (
      cell1.classList.contains(x_class) &&
      cell7.classList.contains(x_class) &&
      !cell4.classList.contains(circle_class)
    ) {
      cell4.click();
    } else if (
      cell2.classList.contains(x_class) &&
      cell8.classList.contains(x_class) &&
      !cell5.classList.contains(circle_class)
    ) {
      cell5.click();
    } else if (
      cell3.classList.contains(x_class) &&
      cell9.classList.contains(x_class) &&
      !cell6.classList.contains(circle_class)
    ) {
      cell6.click();
    } else if (
      cell5.classList.contains(x_class) &&
      cell9.classList.contains(x_class) &&
      !cell1.classList.contains(circle_class)
    ) {
      cell1.click();
    } else if (
      cell5.classList.contains(x_class) &&
      cell7.classList.contains(x_class) &&
      !cell3.classList.contains(circle_class)
    ) {
      cell3.click();
    } else if (
      cell4.classList.contains(x_class) &&
      cell7.classList.contains(x_class) &&
      !cell1.classList.contains(circle_class)
    ) {
      cell1.click();
    } else if (
      cell8.classList.contains(x_class) &&
      cell5.classList.contains(x_class) &&
      !cell2.classList.contains(circle_class)
    ) {
      cell2.click();
    } else if (
      cell9.classList.contains(x_class) &&
      cell6.classList.contains(x_class) &&
      !cell3.classList.contains(circle_class)
    ) {
      cell3.click();
    } else if (
      cell9.classList.contains(x_class) &&
      cell8.classList.contains(x_class) &&
      !cell7.classList.contains(circle_class)
    ) {
      cell7.click();
    } else if (
      cell6.classList.contains(x_class) &&
      cell5.classList.contains(x_class) &&
      !cell4.classList.contains(circle_class)
    ) {
      cell4.click();
    } else if (
      cell3.classList.contains(x_class) &&
      cell2.classList.contains(x_class) &&
      !cell1.classList.contains(circle_class)
    ) {
      cell1.click();
    } else if (
      cell5.classList.contains(x_class) &&
      cell4.classList.contains(x_class) &&
      !cell6.classList.contains(circle_class)
    ) {
      cell6.click();
    } else if (
      cell1.classList.contains(x_class) &&
      cell5.classList.contains(x_class) &&
      !cell9.classList.contains(circle_class)
    ) {
      cell9.click();
    } else if (
      cell1.classList.contains(x_class) &&
      cell2.classList.contains(x_class) &&
      !cell3.classList.contains(circle_class)
    ) {
      cell3.click();
    } else if (
      cell3.classList.contains(x_class) &&
      cell6.classList.contains(x_class) &&
      !cell9.classList.contains(circle_class)
    ) {
      cell9.click();
    } else if (
      cell2.classList.contains(x_class) &&
      cell5.classList.contains(x_class) &&
      !cell8.classList.contains(circle_class)
    ) {
      cell8.click();
    } else if (
      cell3.classList.contains(x_class) &&
      cell5.classList.contains(x_class) &&
      !cell7.classList.contains(circle_class)
    ) {
      cell7.click();
    } else if (
      cell1.classList.contains(x_class) &&
      cell4.classList.contains(x_class) &&
      !cell7.classList.contains(circle_class)
    ) {
      cell7.click();
    } else if (
      cell7.classList.contains(x_class) &&
      cell8.classList.contains(x_class) &&
      !cell9.classList.contains(circle_class)
    ) {
      cell9.click();
    } else if (cpLevel === 'Hard') {
      if (
        cell1.classList.contains(x_class) &&
        !cell5.classList.contains(circle_class) &&
        !cell5.classList.contains(x_class)
      ) {
        cell5.click();
      } else if (
        cell3.classList.contains(x_class) &&
        !cell5.classList.contains(circle_class) &&
        !cell5.classList.contains(x_class)
      ) {
        cell5.click();
      } else if (
        cell7.classList.contains(x_class) &&
        !cell5.classList.contains(circle_class) &&
        !cell5.classList.contains(x_class)
      ) {
        cell5.click();
      } else if (
        cell9.classList.contains(x_class) &&
        !cell5.classList.contains(circle_class) &&
        !cell5.classList.contains(x_class)
      ) {
        cell5.click();
      } else if (
        (cell1.classList.contains(x_class) &&
          cell5.classList.contains(x_class) &&
          cell9.classList.contains(circle_class) &&
          !cell3.classList.contains(circle_class) &&
          !cell3.classList.contains(x_class)) ||
        (cell9.classList.contains(x_class) &&
          cell5.classList.contains(x_class) &&
          cell1.classList.contains(circle_class) &&
          !cell3.classList.contains(circle_class) &&
          !cell3.classList.contains(x_class))
      ) {
        cell3.click();
      } else if (
        (cell3.classList.contains(x_class) &&
          cell5.classList.contains(x_class) &&
          cell7.classList.contains(circle_class) &&
          !cell1.classList.contains(circle_class) &&
          !cell1.classList.contains(x_class)) ||
        (cell7.classList.contains(x_class) &&
          cell5.classList.contains(x_class) &&
          cell3.classList.contains(circle_class) &&
          !cell1.classList.contains(circle_class) &&
          !cell1.classList.contains(x_class))
      ) {
        cell1.click();
      } else if (
        cell5.classList.contains(x_class) &&
        !cell1.classList.contains(circle_class) &&
        !cell1.classList.contains(x_class) &&
        !cell3.classList.contains(circle_class) &&
        !cell3.classList.contains(x_class) &&
        !cell7.classList.contains(circle_class) &&
        !cell7.classList.contains(x_class) &&
        !cell9.classList.contains(circle_class) &&
        !cell9.classList.contains(x_class)
      ) {
        let options = [1, 3, 7, 9];
        let answer = Math.floor(Math.random() * 4);
        document.getElementById(`${options[answer]}`).click();
      } else {
        result = Math.floor(Math.random() * cells.length);
        document.getElementById(`${cells[result]}`).click();
      }
    } else {
      result = Math.floor(Math.random() * cells.length);
      document.getElementById(`${cells[result]}`).click();
    }
  } else {
    result = Math.floor(Math.random() * cells.length);
    document.getElementById(`${cells[result]}`).click();
  }
}
