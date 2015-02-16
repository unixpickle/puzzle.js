function phase1Search(cube, heuristic, moves, depth, cb) {
  // If we are done, check if it's solved and run the callback.
  if (moves.length === depth) {
    if (!phase1Solved(cube)) {
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
  var turns = allMoves();
  for (var i = 0, len = turns.length; i < len; ++i) {
    var newState = cube.copy();
    newState.move(turns[i]);
    moves.push(turns[i]);
    if (!phase1Search(newState, heuristic, moves, depth, cb)) {
      return false;
    }
    moves.splice(moves.length-1, 1);
  }
  return true;
}

function phase1Solved(cube) {
  // All corners must be oriented.
  for (var i = 0; i < 7; ++i) {
    if (cube.corners.corners[i].orientation !== 0) {
      return false;
    }
  }
  
  // All edges must be oriented.
  for (var i = 0; i < 11; ++i) {
    if (cube.edges.edges[i].filp) {
      return false;
    }
  }
  
  // All slice edges must be on M slice.
  var sliceEdges = [0, 2, 6, 8];
  for (var i = 0; i < 4; ++i) {
    var piece = cube.edges.edges[sliceEdges[i]].piece;
    if (sliceEdges.indexOf(piece) < 0) {
      return false;
    }
  }
  
  return true;
}

function solvePhase1(cube, heuristic, cb) {
  for (var depth = 0; depth < 20; ++depth) {
    if (!phase1Search(cube, heuristic, [], depth, cb)) {
      break;
    }
  }
}

exports.phase1Solved = phase1Solved;
exports.solvePhase1 = solvePhase1;
