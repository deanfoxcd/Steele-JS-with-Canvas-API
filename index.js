const { World, Engine, Runner, Bodies, Render, Body, Events } = Matter;
const width = window.innerWidth;
const height = window.innerHeight;

const cellsRows = 7;
const cellsColumns = 5;
const unitWidth = width / cellsColumns;
const unitHeight = height / cellsRows;

const newGameBtn = document.querySelector('.new-game-btn');

const shuffleArray = function (array) {
  for (let i = array.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
    return array;
  }
};

const game = function () {
  const engine = Engine.create();
  engine.world.gravity.y = 0;
  const { world } = engine;
  const render = Render.create({
    element: document.body,
    engine: engine,
    options: {
      wireframes: false,
      width,
      height,
    },
  });

  Render.run(render);
  Runner.run(Runner.create(), engine);

  // Walls
  const walls = [
    Bodies.rectangle(width / 2, 0, width, 2, { isStatic: true }),
    Bodies.rectangle(width / 2, height, width, 2, { isStatic: true }),
    Bodies.rectangle(0, height / 2, 2, height, { isStatic: true }),
    Bodies.rectangle(width, height / 2, 2, height, { isStatic: true }),
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
  // console.log(startCell);

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

  // console.log(verticals);
  // console.log(horizontals);

  horizontals.forEach((row, rowIndex) => {
    row.forEach((open, columnIndex) => {
      if (open) return;
      const wall = Bodies.rectangle(
        columnIndex * unitWidth + unitWidth / 2,
        rowIndex * unitHeight + unitHeight,
        unitWidth,
        5,
        {
          isStatic: true,
          label: 'wall',
          render: {
            fillStyle: '#F08080	',
          },
        }
      );
      World.add(world, wall);
    });
  });

  verticals.forEach((row, rowIndex) => {
    row.forEach((open, columnIndex) => {
      if (open) return;
      const wall = Bodies.rectangle(
        columnIndex * unitWidth + unitWidth,
        rowIndex * unitHeight + unitHeight / 2,
        5,
        unitHeight,
        {
          isStatic: true,
          label: 'wall',
          render: {
            fillStyle: '#F08080	',
          },
        }
      );
      World.add(world, wall);
    });
  });

  // Create Ball and Goal
  const goal = Bodies.rectangle(
    width - unitWidth / 2,
    height - unitHeight / 2,
    unitWidth * 0.7,
    unitHeight * 0.7,
    {
      isStatic: true,
      label: 'goal',
      render: {
        fillStyle: '#8FBC8F	',
      },
    }
  );
  World.add(world, goal);

  const ball = Bodies.circle(
    unitWidth / 2,
    unitHeight / 2,
    Math.min(unitHeight, unitWidth) / 3,
    {
      label: 'ball',
      render: {
        fillStyle: '#4169E1	',
      },
    }
  );
  World.add(world, ball);

  document.addEventListener('keydown', (e) => {
    const { x, y } = ball.velocity;
    if (e.key === 'w') Body.setVelocity(ball, { x: x, y: y - 5 });
    if (e.key === 'd') Body.setVelocity(ball, { x: x + 5, y: y });
    if (e.key === 's') Body.setVelocity(ball, { x: x, y: y + 5 });
    if (e.key === 'a') Body.setVelocity(ball, { x: x - 5, y: y });
  });

  // Win Condition
  Events.on(engine, 'collisionStart', (e) => {
    e.pairs.forEach((coll) => {
      // console.log(coll.bodyA);
      const labels = ['ball', 'goal'];

      if (
        labels.includes(coll.bodyA.label) &&
        labels.includes(coll.bodyB.label)
      ) {
        world.gravity.y = 1;
        world.bodies.forEach((body) => {
          if (body.label === 'wall') Body.setStatic(body, false);
        });
        document.querySelector('.winner').classList.remove('hidden');
        newGameBtn.classList.remove('hidden');
        newGameBtn.addEventListener('click', (event) => {
          event.preventDefault();
          World.clear(world);
          Engine.clear(engine);
          Render.stop(render);
          render.canvas.remove();
          render.canvas = null;
          render.context = null;
          render.textures = {};
          console.log('reset clicked');
          document.querySelector('.winner').classList.add('hidden');
          game();
        });
      }
    });
  });
};

game();
