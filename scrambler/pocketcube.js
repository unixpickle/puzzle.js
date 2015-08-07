var pocketHeuristic = null;
var MIN_POCKET_CUBE_LENGTH = 4;
var REGULAR_POCKET_CUBE_LENGTH = 8;

function pocketMoves(count) {
  var moves = pocketcube.scrambleMoves(count);
  return pocketcube.movesToString(moves);
}

function pocketOptState() {
  if (pocketHeuristic === null) {
    pocketHeuristic = new pocketcube.FullHeuristic(5);
  }
  while (true) {
    var state = pocketcube.randomState();
    var solution = pocketcube.solve(state, pocketHeuristic);
    if (solution.length >= MIN_POCKET_CUBE_LENGTH) {
      return pocketcube.movesToString(solution);
    }
  }
}

function pocketState() {
  if (pocketHeuristic === null) {
    pocketHeuristic = new pocketcube.FullHeuristic(5);
  }
  while (true) {
    var state = pocketcube.randomState();
    var solution = pocketcube.solve(state, pocketHeuristic);
    if (solution.length >= MIN_POCKET_CUBE_LENGTH) {
      if (solution.length < REGULAR_POCKET_CUBE_LENGTH) {
        solution = pocketcube.solve(state, pocketHeuristic, REGULAR_POCKET_CUBE_LENGTH);
      }
      return pocketcube.movesToString(solution);
    }
  }
}
