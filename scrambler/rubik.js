var rubikTables = null;
var rubikTimeouts = null;

function rubikCorners() {
  return solveRubikState(rubik.randomCorners);
}

function rubikEdges() {
  return solveRubikState(rubik.randomEdges);
}

function rubikLastLayer() {
  return solveRubikState(rubik.randomLastLayer);
}

function rubikMoves(count) {
  var moves = rubik.scrambleMoves(count);
  return rubik.movesToString(moves);
}

function rubikState() {
  return solveRubikState(rubik.randomState);
}

function rubikZBLL() {
  return solveRubikState(rubik.randomZBLL);
}

function rubik2GLL() {
  return solveRubikState(rubik.random2GLL);
}

function solveRubikState(stateGen) {
  var state = stateGen();
  while (state.solved()) {
    state = stateGen();
  }

  // Make sure the needed global variables are there.
  if (rubikTables === null || rubikTimeouts === null) {
    rubikTables = new rubik.SolveTables();
    rubikTimeouts = new rubik.SolveTimeouts();
  }

  // Solve the cube!
  var solution = rubik.solveCube(state, rubikTables, rubikTimeouts);
  if (solution === null) {
    return 'Timeout';
  }
  return rubik.movesToString(solution);
}
