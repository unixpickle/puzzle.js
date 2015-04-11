var pocketHeuristic = null;

function pocketMoves(count) {
  var moves = pocketcube.scrambleMoves(count);
  return pocketcube.movesToString(moves);
}

function pocketOptState() {
  if (pocketHeuristic === null) {
    pocketHeuristic = new pocketcube.FullHeuristic(5);
  }
  var state = pocketcube.randomState();
  var solution = pocketcube.solve(state, pocketHeuristic);
  return pocketcube.movesToString(solution);
}

function pocketState() {
  if (pocketHeuristic === null) {
    pocketHeuristic = new pocketcube.FullHeuristic(5);
  }
  var state = pocketcube.randomState();
  var solution = pocketcube.solve(state, pocketHeuristic, 8);
  return pocketcube.movesToString(solution);
}