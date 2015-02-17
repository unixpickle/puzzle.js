function depthFirst(cube, heuristic, moves, depth) {
  if (depth === 0) {
    if (cube.solved()) {
      return [];
    } else {
      return null;
    }
  } else if (heuristic.lookup(cube) > depth) {
    return null;
  }
  
  // Apply all the moves.
  for (var i = 0, len = moves.length; i < len; ++i) {
    var newState = cube.copy();
    newState.move(moves[i]);
    var result = depthFirst(newState, heuristic, moves, depth-1);
    if (result !== null) {
      return [moves[i]].concat(result);
    }
  }
  
  return null;
}

function solve(cube, heuristic, moves, maxDepth) {
  if ('undefined' === typeof maxDepth) {
    maxDepth = 11;
  }
  for (var depth = 0; depth <= maxDepth; ++depth) {
    var solution = depthFirst(cube, heuristic, moves, depth);
    if (solution !== null) {
      return solution;
    }
  }
  return null;
}

exports.solve = solve;
