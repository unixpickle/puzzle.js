var skewbHeuristic = null;

function skewbMoves(count) {
  var moves = skewb.scrambleMoves(count);
  return skewb.movesToString(moves);
}

function skewbState() {
  if (skewbHeuristic === null) {
    skewbHeuristic = new skewb.Heuristic();
  }
  var state = skewb.randomState();
  var solution = skewb.solve(state, skewbHeuristic);
  return skewb.movesToString(solution);
}
