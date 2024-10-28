const { World, Engine, Runner, Bodies, Render } = Matter;
const width = 600;
const height = 600;
const cellsRows = 3;
const cellsColumns = 3;

const engine = Engine.create();
const { world } = engine;
const render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    wireframes: true,
    width,
    height,
  },
});

Render.run(render);
Runner.run(Runner.create(), engine);

// Walls
const walls = [
  Bodies.rectangle(width / 2, 0, width, 40, { isStatic: true }),
  Bodies.rectangle(width / 2, height, width, 40, { isStatic: true }),
  Bodies.rectangle(0, height / 2, 40, height, { isStatic: true }),
  Bodies.rectangle(width, height / 2, 40, height, { isStatic: true }),
];

World.add(world, walls);

// Maze Generation

// const grid = [];

// for (let i = 0; i < 3; i++) {
//   grid.push([]);
//   for (let j = 0; j < 3; j++) {
//     grid[i].push(false);
//   }
// }

const generateGrid = function (rows, columns) {
  return (grid = Array(rows)
    .fill(null)
    .map(() => Array(columns).fill(false)));
};
const mazeGrid = generateGrid(cellsRows, cellsColumns);

const verticals = generateGrid(cellsRows, cellsColumns - 1);
const horizontals = generateGrid(cellsRows - 1, cellsColumns);

// console.log(mazeGrid);
// console.log(verticals);
// console.log(horizontals);

const startRow = Math.trunc(Math.random() * cellsRows);
const startColumn = Math.trunc(Math.random() * cellsColumns);
const startCell = [startRow, startColumn];
console.log(startCell);

const stepThroughCell = (row, column) => {
  if (mazeGrid[row][column]) return;
  mazeGrid[row][column] = true;

  const neighbors = [
    [row - 1, column, 'up'], // Up - H r-1, c
    [row, column + 1, 'right'], // Right - V r, c
    [row + 1, column, 'down'], // Down - H r, c
    [row, column - 1, 'left'], // Left - V r, c-1
  ];
  //   for (let neighbor of neighbors) {
  //     const [nextRow, nextColumn] = neighbor;
  //     if (
  //       nextRow < 0 ||
  //       nextRow >= cellsRows ||
  //       nextColumn < 0 ||
  //       nextColumn >= cellsColumns ||
  //       mazeGrid[nextRow][nextColumn] === true
  //     )
  //       continue;
  //   }
  let viableNeighbors = [];
  for (let i = 0; i < neighbors.length; i++) {
    const [nextRow, nextColumn, direction] = neighbors[i];
    if (
      nextRow < 0 ||
      nextRow >= cellsRows ||
      nextColumn < 0 ||
      nextColumn >= cellsColumns ||
      mazeGrid[nextRow][nextColumn] === true
    )
      continue;
    viableNeighbors.push(neighbors[i]);
  }
  //   console.log(viableNeighbors);

  const targetCell =
    viableNeighbors[Math.floor(Math.random() * viableNeighbors.length)];
  console.log(targetCell);

  const [targetRow, targetColumn] = targetCell;

  if (targetCell[2] === 'up') {
    horizontals[row - 1][column] = true;
  }
  if (targetCell[2] === 'right') {
    verticals[row][column] = true;
  }
  if (targetCell[2] === 'down') {
    horizontals[row][column] = true;
  }
  if (targetCell[2] === 'left') {
    verticals[row][column - 1] = true;
    console.log('moved left');
  }
  console.log(verticals);
  console.log(horizontals);

  stepThroughCell(targetRow, targetColumn);
};

stepThroughCell(startRow, startColumn);
// console.log(mazeGrid);
