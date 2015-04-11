var rubikTables = null;
var rubikTimeouts = null;

function rubikMoves(count) {
  var moves = rubik.scrambleMoves(count);
  return rubik.movesToString(moves);
}

function rubikState() {
  if (rubikTables === null || rubikTimeouts) {
    rubikTables = new rubik.SolveTables();
    rubikTimeouts = new rubik.SolveTimeouts();
  }
  var state = rubik.randomState();
  var solution = rubik.solveCube(state, rubikTables, rubikTimeouts);
  return rubik.movesToString(solution);
}