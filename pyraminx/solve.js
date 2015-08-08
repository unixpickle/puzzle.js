var MAX_MOVE_COUNT = 11;

function depthFirst(state, heuristic, lastMove, moves, depth) {
  if (depth === 0) {
    if (pyraminx.solved()) {
      return [];
    } else {
      return null;
    }
  } else if (heuristic.lowerBound(pyraminx.edges) > depth) {
    return null;
  }

  for (var i = 0; i < 8; ++i) {
    var move = moves[i];
    if (lastMove !== null && move.corner === lastMove.corner) {
      continue;
    }
    var newState = state.copy();
    newState.move(move);
    var solution = depthFirst(newState, heuristic, move, moves, depth-1);
    if (solution !== null) {
      solution.unshift(move);
      return solution;
    }
  }

  return null;
}

function solve(state, heuristic, minDepth) {
  for (var depth = minDepth || 0; depth <= MAX_MOVE_COUNT; ++depth) {
    var solution = depthFirst(state, heuristic, null, allMoves(), depth);
    if (solution !== null) {
      return solution;
    }
  }
  return null;
}

exports.solve = solve;
