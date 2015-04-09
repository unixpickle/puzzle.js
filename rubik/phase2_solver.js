// Phase2Solver implements the backbone of solvePhase2().
function Phase2Solver(heurstic, moves, deadline) {
  this.heuristic = heuristic;
  this.moves = moves;
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
    return this._search(cube, 0, 0);
  } catch (e) {
    return null;
  }
};

Phase2Solver.prototype._checkExpired = function() {
  if (new Date().getTime() < this.deadline) {
    throw new Error('solve timed out');
  }
};

Phase2Solver.prototype._search = function(cube, depth, lastFace) {
  if (depth === this.depth) {
    if (cube.solved()) {
      this._checkExpired();
      return [];
    }
    return null;
  } else if (this.heuristic.lowerBound(cube) > this.depth - depth) {
    return null;
  }
  
  var newCube = this.cubes[depth];
  for (var i = 0; i < 10; ++i) {
    var face = p2MoveFace(i);
    if (face === lastFace) {
      continue;
    }
    
    newCube.set(cube);
    newCube.move(i, this.moves);
    
    var res = this._search(newCube, depth+1, face);
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
function solvePhase2(cube, maxLen, heuristic, moves, timeout) {
  timeout = (timeout || 1000000);
  var deadline = new Date().getTime() + timeout;
  var solver = new Phase2Solver(heuristic, moves, deadline);
  for (var depth = 0; depth <= maxLen; ++depth) {
    var solution = solver.solve(cube);
    if (solution !== null) {
      return solution;
    }
    solver.deepen();
  }
  return null;
}