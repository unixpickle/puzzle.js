function depthFirst(cube, heuristic, moves, depth, lastFace, lastLastFace) {
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
    var move = moves[i];
    var face = move.face();

    // Prevent redundant moves.
    if (face === lastFace) {
      continue;
    } else if (face === lastLastFace) {
      // If lastFace was on the same axis as lastLastFace, this move is
      // redundant.
      if (Math.ceil(lastFace/2) === Math.ceil(lastLastFace/2)) {
        continue;
      }
    }

    // Generate the new state.
    var newState = cube.copy();
    newState.move(move);

    var result = depthFirst(newState, heuristic, moves, depth-1, face,
      lastFace);
    if (result !== null) {
      return [move].concat(result);
    }
  }

  return null;
}

function solve(cube, heuristic, minDepth) {
  for (var depth = minDepth || 0; depth <= 11; ++depth) {
    var solution = depthFirst(cube, heuristic, basisMoves(), depth, 0, 0);
    if (solution !== null) {
      return solution;
    }
  }
  return null;
}

exports.solve = solve;
