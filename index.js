const { World, Engine, Runner, Bodies, Render } = Matter;
const width = 600;
const height = 600;
const cellsRows = 3;
const cellsColumns = 3;
const unitWidth = width / cellsColumns;
const unitHeight = height / cellsRows;

const shuffleArray = function (array) {
  for (let i = array.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
    return array;
  }
};

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

  shuffleArray(neighbors);

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

    if (direction === 'up') {
      horizontals[row - 1][column] = true;
    } else if (direction === 'right') {
      verticals[row][column] = true;
    } else if (direction === 'down') {
      horizontals[row][column] = true;
    } else if (direction === 'left') {
      verticals[row][column - 1] = true;
    }

    stepThroughCell(nextRow, nextColumn);
  }
};

stepThroughCell(startRow, startColumn);
// console.log(mazeGrid);

console.log(verticals);
console.log(horizontals);

horizontals.forEach((row, rowIndex) => {
  row.forEach((open, columnIndex) => {
    if (open) return;
    const wall = Bodies.rectangle(
      columnIndex * unitWidth + unitWidth / 2,
      rowIndex * unitWidth + unitWidth,
      unitWidth,
      5,
      { isStatic: true }
    );
    World.add(world, wall);
  });
});

verticals.forEach((row, rowIndex) => {
  row.forEach((open, columnIndex) => {
    if (open) return;
    const wall = Bodies.rectangle(
      columnIndex * unitHeight + unitHeight,
      rowIndex * unitHeight + unitHeight / 2,
      5,
      unitHeight,
      { isStatic: true }
    );
    World.add(world, wall);
  });
});
