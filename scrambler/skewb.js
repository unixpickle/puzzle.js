var skewbHeuristic = null;

function skewbCenters() {
  var state = new skewb.Skewb();
  state.centers = skewb.randomCenters();
  return solveSkewbState(state);
}

function skewbMoves(count) {
  var moves = skewb.scrambleMoves(count);
  return skewb.movesToString(moves);
}

function skewbState() {
  return solveSkewbState(skewb.randomState());
}

function solveSkewbState(state) {
  if (skewbHeuristic === null) {
    skewbHeuristic = new skewb.Heuristic();
  }
  var solution = skewb.solve(state, skewbHeuristic);
  return skewb.movesToString(solution);
}
