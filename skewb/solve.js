function depthFirst(start, remaining, heuristic, lastFace) {
  if (remaining === 0) {
    if (!start.solved()) {
      return null;
    } else {
      return [];
    }
  } else if (heuristic.lookup(start) > remaining) {
    return null;
  }
  
  for (var i = 0; i < 4; ++i) {
    if (i === lastFace) {
      continue;
    }
    for (var j = 0; j < 2; ++j) {
      var move = {face: i, clock: j===0};
      var state = start.copy();
      state.move(move);
      var solution = depthFirst(state, remaining-1, heuristic, i);
      if (solution !== null) {
        return [move].concat(solution);
      }
    }
  }
  return null;
}

function solve(state, heuristic) {
  for (var i = 0; i < 11; ++i) {
    var solution = depthFirst(state, i, heuristic, -1);
    if (solution !== null) {
      for (var i = 0, len = solution.length; i < len; ++i) {
        solution[i] = new Move(solution[i].face, solution[i].clock);
      }
      return solution;
    }
  }
  return null;
}

exports.solve = solve;
