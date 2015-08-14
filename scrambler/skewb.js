var skewbHeuristic = null;
var MIN_SKEWB_LENGTH = 7;

function skewbCenters() {
  var state = new skewb.Skewb();
  while (state.solved()) {
    state.centers = skewb.randomCenters();
  }
  return solveSkewbState(state, 0);
}

function skewbMoves(count) {
  var moves = skewb.scrambleMoves(count);
  return skewb.movesToString(moves);
}

function skewbState() {
  while (true) {
    var solution = solveSkewbState(skewb.randomState(), MIN_SKEWB_LENGTH);
    if (solution !== null) {
      return solution;
    }
  }
}

function solveSkewbState(state, minLength) {
  if (skewbHeuristic === null) {
    skewbHeuristic = new skewb.Heuristic();
  }
  var solution = skewb.solve(state, skewbHeuristic);
  if (solution.length < minLength) {
    return null;
  }
  return skewb.movesToString(solution);
}
