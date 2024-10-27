const { World, Engine, Runner, Bodies, Render, MouseConstraint, Mouse } =
  Matter;
const width = 800;
const height = 600;

const engine = Engine.create();
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

World.add(
  world,
  MouseConstraint.create(engine, {
    mouse: Mouse.create(render.canvas),
  })
);
