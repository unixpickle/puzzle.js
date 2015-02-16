function phase2Search(cube, heuristic, moves, depth, cb) {
  // If we are done, check if it's solved and run the callback.
  if (moves.length === depth) {
    if (!cube.solved()) {
      return true;
    }
    if (cb(moves.slice()) === true) {
      return true;
    } else {
      return false;
    }
  }
  
  // Check the heuristic.
  if (heuristic.lookup(cube) > depth-moves.length) {
    return true;
  }
  
  // Apply each move and go deeper.
  var turns = phase2Moves();
  for (var i = 0, len = turns.length; i < len; ++i) {
    var newState = cube.copy();
    newState.move(turns[i]);
    moves.push(turns[i]);
    if (!phase2Search(newState, heuristic, moves, depth, cb)) {
      return false;
    }
    moves.splice(moves.length-1, 1);
  }
  return true;
}

function solvePhase2(cube, heuristic, cb) {
  for (var depth = 0; depth < 19; ++depth) {
    if (!phase2Search(cube, heuristic, [], depth, cb)) {
      break;
    }
  }
}

exports.solvePhase2 = solvePhase2;
