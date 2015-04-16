// Phase2Solver implements the backbone of solvePhase2().
function Phase2Solver(heuristic, coords, deadline) {
  this.heuristic = heuristic;
  this.coords = coords;
  this.deadline = deadline;
  
  this.depth = 0;
  this.cubes = [];
}

// deepen prepares this solver for a deeper search.
Phase2Solver.prototype.deepen = function() {
  this.cubes[this.depth] = new Phase2Cube();
  this.depth++;
};

// solve runs a search at the current depth.
Phase2Solver.prototype.solve = function(cube) {
  try {
    return this._search(cube, 0, 0, -1);
  } catch (e) {
    if (e !== 'solve timed out') {
      throw e;
    }
    return null;
  }
};

Phase2Solver.prototype._checkExpired = function() {
  if (new Date().getTime() > this.deadline) {
    throw 'solve timed out';
  }
};

Phase2Solver.prototype._search = function(cube, depth, lastFace, lastAxis) {
  if (depth === this.depth) {
    if (cube.solved()) {
      this._checkExpired();
      return [];
    }
    return null;
  } else if (this.heuristic.lowerBound(cube, this.coords) > this.depth-depth) {
    return null;
  }
  
  var newCube = this.cubes[depth];
  for (var i = 0; i < 10; ++i) {
    var face = p2MoveFace(i);
    if (face === lastFace) {
      continue;
    }
    var axis = p2MoveAxis(i);
    if (axis === lastAxis && face >= lastFace) {
      // Avoid redundancies like L2 R2 L2 and enforce an ordering for moves on
      // the same axis.
      continue;
    }
    
    newCube.set(cube);
    newCube.move(i, this.coords);
    
    var res = this._search(newCube, depth+1, face, axis);
    if (res !== null) {
      res.splice(0, 0, i);
      return res;
    }
    
    if (this.depth - depth >= 7) {
      this._checkExpired();
    }
  }
  
  return null;
};

// solvePhase2 finds a solution to a Phase2Cube and returns it or returns null
// if no solution was found (either because no solution exists or because of a
// timeout).
function solvePhase2(cube, maxLen, heuristic, coords, timeout) {
  timeout = (timeout || 1000000);
  var deadline = new Date().getTime() + timeout;
  var solver = new Phase2Solver(heuristic, coords, deadline);
  for (var depth = 0; depth <= maxLen; ++depth) {
    var solution = solver.solve(cube);
    if (solution !== null) {
      return solution;
    }
    solver.deepen();
  }
  return null;
}

exports.solvePhase2 = solvePhase2;
