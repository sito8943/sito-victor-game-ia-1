console.log("start");
const btn_start = document.getElementById("btn_start");
const solver = document.getElementById("solver");
const timer = document.getElementById("timer");

var inSolve = false; /// esta variable se refiere a si su algoritmo esta en ejecución
var current = [0, 0]; /// esta es su posición en el laverinto

/**
 * @n cantidad de columnas
 * @m cantidad de filas
 * @table matriz del laverinto n x m de valores enteros definidos como : {-1: muro, 0: libre, 1: llave, 2:entrada, 3:salida }
 *
 * @key posición de la llave [i, j]
 * @entrance entrada del laverinto [i, j]
 * @exit salida del laverinto [i, j
 */
var n = 0;
var m = 0;
var table = [[]];
var key = [0, 0];
var exit = [0, 0];
var entrance = [0, 0];

/**
 * SU CÓDIGO VA EN LA LINEA 175, PUEDEN USAR TANTAS FUNCIONES COMO QUIERAN
 * POR FAVOR NO MODIFICAR NINGUN CÓDIGO DE ESTE JS SIN EL CONSENTIMIENTO DEL PROFESOR
 * 🍖🧀 EXCEPCION: EN LA LINEA 40 Y 41 SE GENERA EL TAMAÑO DEL TABLERO PUEDEN MODIFICARLO PARA PROBAR SU CÓDIGO
 *
 * SI SU CÓDIGO SE FUNDE, F5 A LA PAGINA WEB 😃
 * USEN LOS console.log(...) PARA VER EL COMPORTAMIENTO DE SU CÓDIGO
 * 💥 EL OBJETIVO DEL JUEGO ES OBVIO, LLEGAR A LA PUERTA 💥
 * 💥 DEMÁS ESTA DECIR QUE LA PUERTA NO SE ABRE SIN LA LLAVE 💥
 * UN PUNTO MENOS SI ROMPEN LA PUERTA 🤣🤣
 * ⭐⭐ HAPPY CODING ⭐⭐
 */

/**
 * It creates a maze with a random size and places a key in it.
 * @returns the value of the variable "inSolve"
 */
function ready() {
  if (inSolve) return;

  const h = 10 + Math.floor(Math.random() * 10);
  const w = 10 + Math.floor(Math.random() * 10);

  let Maze = new MazeBuilder(h, w);
  Maze.placeKey(); // agregar llave, pueden agregar mas si decean, solo que tienen que iterar por Maze.keys para cojerlas todas.
  Maze.display("maze_container");

  n = Maze.rows;
  m = Maze.cols;
  table = Maze.table;

  key = Maze.keys[0];
  exit = Maze.doorPosExit;
  entrance = Maze.doorPosIn;

  console.log("Tabla de " + n + " x " + m);
  console.log("LLave: ", key);
  console.log("Entrada: ", entrance);
  console.log("Salida: ", exit);

  configureSolver(n, m);
  current = [...entrance];
  getCell(current).classList.add("current");
}

/**
 * It creates a grid of divs with the same dimensions as the maze
 * @param n - number of rows
 * @param m - number of columns
 */
function configureSolver(n, m) {
  solver.style.width = `calc(1em * ${m})`;
  solver.style.height = `calc(1em * ${n})`;

  while (solver.firstChild) {
    solver.removeChild(solver.firstChild);
  }

  const container = document.createElement("div");
  container.id = "maze_solver";

  for (let i = 0; i < n; i++) {
    let rowDiv = document.createElement("div");
    for (let j = 0; j < m; j++) {
      let cellDiv = document.createElement("div");
      cellDiv.setAttribute("row", i);
      cellDiv.setAttribute("col", j);
      cellDiv.classList.add("cell_solver");
      rowDiv.appendChild(cellDiv);
    }
    container.appendChild(rowDiv);
  }

  solver.appendChild(container);
}

/**
 * It takes a position (an array of two numbers) and returns the corresponding cell in the maze.
 * @param pos - The position of the cell you want to get.
 * @returns The cell at the given position.
 */
function getCell(pos) {
  return document.querySelector(
    `#maze_solver > div:nth-child(${pos[0] + 1}) > div:nth-child(${pos[1] + 1})`
  );
}

/**
 * It moves the current cell up by one cell
 * @param [ind=0] - the index of the current position in the array
 * @param [inc] - the increment of the movement.
 * @returns A promise.
 */
function moveTop(ind = 0, inc = -1) {
  return new Promise((res, rel) => {
    setTimeout(() => {
      const to = [...current];
      to[ind] += inc;
      const cell = getCell(current);
      const cell_to = getCell(to);

      // console.log(cell)
      // console.log(cell_to)

      cell.classList.remove("current");
      if (cell_to.classList.contains("path")) {
        cell.classList.add("old");
      } else {
        cell.classList.add("path");
      }
      cell_to.classList.add("current");
      cell_to.classList.remove("path");
      cell_to.classList.remove("old");
      current = [...to];

      res();
    }, +timer.value);
  });
}

/**
 * MoveDown() moves the top row to the bottom row.
 * @returns The function moveTop is being returned.
 */
function moveDown() {
  return moveTop(0, 1);
}

/**
 * Move the top row of the matrix to the left.
 * @returns The function moveTop is being returned.
 */
function moveLeft() {
  return moveTop(1, -1);
}

/**
 * MoveRight() moves the top right corner of the square one unit to the right.
 * @returns The function moveTop is being returned.
 */
function moveRight() {
  return moveTop(1, 1);
}

/**
 * The function start() is an asynchronous function that changes the text of the button to "Wait",
 * removes the class "start" from the button, adds the class "stop" to the button, sets the variable
 * inSolve to true, calls the function configureSolver(), sets the variable current to the value of the
 * array entrance, adds the class "current" to the cell at the current position, and then calls the
 * function solve_maze() and waits for it to finish before calling the function stop().
 */
async function start() {
  btn_start.innerText = "Wait";
  btn_start.classList.remove("start");
  btn_start.classList.add("stop");
  inSolve = true;

  configureSolver(n, m);
  current = [...entrance];
  getCell(current).classList.add("current");

  await solve_maze();

  stop();
}

function stop() {
  btn_start.innerText = "Start";
  btn_start.classList.remove("stop");
  btn_start.classList.add("start");
  inSolve = false;
}

btn_start.addEventListener("click", () => {
  // if (inSolve) stop()
  if (!inSolve) start();
});

document.getElementById("reset").addEventListener(
  "click",
  () => {
    ready();
  },
  false
);

document.addEventListener("DOMContentLoaded", function (event) {
  ready();
});

/**
 * If the x value is greater than 1 and the value of the table at the y and x - 1 is not -1, return
 * true, it can move to the left, otherwise return false.
 * @param y - the y coordinate of the current cell
 * @param x - the x coordinate of the current cell
 * @returns a boolean value.
 */
const validLeft = (y, x) => {
  if (x - 1 > 0 && table[y][x - 1] !== -1) return true;
  return false;
};

/**
 * If the y-1 position is greater than 0 and the table at the y-1 position is not -1, return true, it can move to the top,
 * otherwise return false.
 * @param y - the y coordinate of the current cell
 * @param x - the x coordinate of the current cell
 * @returns a boolean value.
 */
const validTop = (y, x) => {
  if (y - 1 > 0 && table[y - 1][x] !== -1) return true;
  return false;
};

/**
 * If the next row is within the table and the next row's value is not -1, return true, it can move to the bottom, otherwise
 * return false.
 * @param y - the y coordinate of the current cell
 * @param x - the x coordinate of the current cell
 * @returns a boolean value.
 */
const validDown = (y, x) => {
  if (y + 1 < table.length && table[y + 1][x] !== -1) return true;
  return false;
};

/**
 * If the next column is within the table and the next column is not a wall, return true, it can move to the right, otherwise,
 * return false.
 * @param y - the y coordinate of the current cell
 * @param x - the x coordinate of the current cell
 * @returns a boolean value.
 */
const validRight = (y, x) => {
  if (x + 1 < table[y].length && table[y][x + 1] !== -1) return true;
  return false;
};

/**
 * If the array of visited coordinates contains the current coordinates, return true, otherwise return
 * false.
 * @param arrayOfVisited - an array of arrays that contain the y and x coordinates of the visited nodes
 * @param y - the y coordinate of the current position
 * @param x - the x coordinate of the current cell
 * @returns a boolean value.
 */
const visitedAlreadyValidation = (arrayOfVisited, y, x) => {
  const filtered = arrayOfVisited.filter((item) => {
    if (item[0] === y && item[1] === x) return item;
    return null;
  });
  if (filtered.length > 0) return true;
  return false;
};

/**
 * If the current position is not the same as the key position, return false. Otherwise, return true.
 * @returns a boolean value.
 */
const haveTheKey = () => {
  if (current[0] !== key[0] || current[1] !== key[1]) return false;
  return true;
};

/**
 * If the current position is on the same row as the exit and the current position is on the first
 * column, then return true. Otherwise, return false.
 * @returns A boolean value.
 */
const isInTheDoor = () => {
  if (current[0] === 1 && current[1] === exit[1]) return true;
  return false;
};

const dist_euclidean = (x, y, xk, yk) => {
  return Math.abs(x - xk) + Math.abs(y - yk);
};

/**
 * It moves the current position to the next valid position, if there is no valid position, it moves to
 * the previous position.
 * @param visited - an array of the current path
 * @param visitedAlready - an array of arrays that contains the coordinates of the cells that have
 * already been visited
 */
const move = async (visited, visitedAlready) => {
  let cantMove = false;
  // going left first
  if (
    validLeft(current[0], current[1]) &&
    !visitedAlreadyValidation(visitedAlready, current[0], current[1] - 1)
  )
    await moveLeft();
  // going top
  else if (
    validTop(current[0], current[1]) &&
    !visitedAlreadyValidation(visitedAlready, current[0] - 1, current[1])
  )
    await moveTop();
  // going right
  else if (
    validRight(current[0], current[1]) &&
    !visitedAlreadyValidation(visitedAlready, current[0], current[1] + 1)
  )
    await moveRight();
  // going down
  else if (
    validDown(current[0], current[1]) &&
    !visitedAlreadyValidation(visitedAlready, current[0] + 1, current[1])
  )
    await moveDown();
  else cantMove = true;

  if (cantMove) {
    visited.pop();
    switch (whichNeighborIs(visited[visited.length - 1])) {
      case "left":
        await moveLeft();
        break;
      case "top":
        await moveTop();
        break;
      case "right":
        await moveRight();
        break;
      default:
        await moveDown();
        break;
    }
  } else {
    visited.push(current);
    visitedAlready.push(current);
  }
};
const move_vic = async (visited, visitedAlready, target) => {
  let cantMove = false;
  let dir_move,
    dist = 99999;
  // going left first
  console.log(`POSICION ${current[1]},${current[0]}`);
  console.log(
    `Left`,
    dist_euclidean(current[1] - 1, current[0], target[1], target[0]),
    dist
  );
  if (
    validLeft(current[0], current[1]) &&
    !visitedAlreadyValidation(visitedAlready, current[0], current[1] - 1) &&
    dist_euclidean(current[1] - 1, current[0], target[1], target[0]) < dist
  ) {
    dist = dist_euclidean(current[1] - 1, current[0], target[1], target[0]);
    dir_move = moveLeft;
    console.log(`Dist: ${dist} direcion Left`);
  }
  // await moveLeft();
  // going top
  console.log(
    `Top`,
    dist_euclidean(current[1], current[0] - 1, target[1], target[0]),
    dist
  );
  if (
    validTop(current[0], current[1]) &&
    !visitedAlreadyValidation(visitedAlready, current[0] - 1, current[1]) &&
    dist_euclidean(current[1], current[0] - 1, target[1], target[0]) < dist
  ) {
    dist = dist_euclidean(current[1], current[0] - 1, target[1], target[0]);
    dir_move = moveTop;
    console.log(`Dist: ${dist} direcion Top`);
  }
  // await moveTop();
  // going right
  console.log(
    `right`,
    dist_euclidean(current[1] + 1, current[0], target[1], target[0]),
    dist
  );
  if (
    validRight(current[0], current[1]) &&
    !visitedAlreadyValidation(visitedAlready, current[0], current[1] + 1) &&
    dist_euclidean(current[1] + 1, current[0], target[1], target[0]) < dist
  ) {
    dist = dist_euclidean(current[1] + 1, current[0], target[1], target[0]);
    dir_move = moveRight;
    console.log(`Dist: ${dist} direcion Right`);
  }
  // await moveRight();
  // going down
  console.log(
    "down",
    dist_euclidean(current[1], current[0] + 1, target[1], target[0]),
    dist
  );
  if (
    validDown(current[0], current[1]) &&
    !visitedAlreadyValidation(visitedAlready, current[0] + 1, current[1]) &&
    dist_euclidean(current[1], current[0] + 1, target[1], target[0]) < dist
  ) {
    dist = dist_euclidean(current[1], current[0] + 1, target[1], target[0]);
    dir_move = moveDown;
    console.log(`Dist: ${dist} direcion Down`);
  }
  //     await moveDown();
  if (dist === 99999) cantMove = true;

  if (cantMove) {
    visited.pop();
    switch (whichNeighborIs(visited[visited.length - 1])) {
      case "left":
        await moveLeft();
        break;
      case "top":
        await moveTop();
        break;
      case "right":
        await moveRight();
        break;
      default:
        await moveDown();
        break;
    }
  } else {
    await dir_move();
    visited.push(current);
    visitedAlready.push(current);
  }
};
/**
 * If the current cell's y coordinate is one less than the neighbor's y coordinate, return 'left',
 * if the current cell's x coordinate is one less than the neighbor's x coordinate, return 'top',
 * if the current cell's y coordinate is one more than the neighbor's y coordinate, return 'right',
 * if the current cell's x coordinate is one more than the neighbor's x coordinate, return 'down'.
 * @param neighbor - the neighbor we're checking
 * @returns The direction of the neighbor.
 */
const whichNeighborIs = (neighbor) => {
  if (current[1] - 1 === neighbor[1]) return "left";
  if (current[0] - 1 === neighbor[0]) return "top";
  if (current[1] + 1 === neighbor[1]) return "right";
  if (current[0] + 1 === neighbor[0]) return "down";
};

/**
 * It's a recursive function that moves the player to the next available cell, and if it's a dead end,
 * it backtracks to the previous cell and moves to the next available cell.
 */
async function solve_maze() {
  const visited = [...current];
  const visitedAlready = [];

  // looking for the key
  while (!haveTheKey()) await move_vic(visited, visitedAlready, key);

  // reset now looking for door
  visited.splice(0, visited.length);
  visitedAlready.splice(0, visitedAlready.length);
  visited.push([...key]);
  visitedAlready.push([...key]);

  // looking for the door
  while (!isInTheDoor()) await move_vic(visited, visitedAlready, exit);
}

const visited = [...current];
const visitedAlready = [];
document.getElementById("step").onclick = async (e) => {
  await move_vic(visited, visitedAlready, key);
};
