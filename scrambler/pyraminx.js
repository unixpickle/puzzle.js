var pyraminxHeuristic = null;
var MIN_PYRAMINX_LENGTH = 6;
var PYRAMINX_HEURISTIC_DEPTH = 7;

function pyraminxState() {
  if (pyraminxHeuristic === null) {
    pyraminxHeuristic = new pyraminx.EdgesHeuristic(PYRAMINX_HEURISTIC_DEPTH);
  }
  while (true) {
    var solution = pyraminx.solve(pyraminx.randomState(), pyraminxHeuristic);
    if (solution.length < MIN_PYRAMINX_LENGTH) {
      continue;
    }
    var tipMoves = pyraminx.randomTipMoves();
    var solutionStr = pyraminx.movesToString(solution);
    if (tipMoves !== '') {
      return solutionStr + ' ' + tipMoves;
    } else {
      return solutionStr;
    }
  }
}
