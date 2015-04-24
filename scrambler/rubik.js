var rubikTables = null;
var rubikTimeouts = null;

function rubikZBLL() {
  return solveRubikState(rubik.randomZBLL());
}

function rubikLastLayer() {
  return solveRubikState(rubik.randomLastLayer());
}

function rubikMoves(count) {
  var moves = rubik.scrambleMoves(count);
  return rubik.movesToString(moves);
}

function rubikState() {
  return solveRubikState(rubik.randomState());
}

function solveRubikState(state) {
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
