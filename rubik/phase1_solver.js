// A Solver keeps track of context for a depth-first search.
function Solver(heuristic, moves, cb, deadline, depth) {
  this.heuristic = heuristic;
  this.moves = moves;
  this.cb = cb;
  this.deadline = deadline;
  this.depth = depth;
  
  // this.basis caches 18 Move objects to avoid allocation.
  this.basis = [];
  for (var i = 0; i < 18; ++i) {
    this.basis[i] = new Move(i);
  }
  
  // this.preAllocCubes caches a cube per level of depth in the search.
  this.preAllocCubes = [];
  for (var i = 0; i < depth; ++i) {
    this.preAllocCubes[i] = new Phase1Cube();
  }
  
  // this.solution is used to track the current solution; using this allows us
  // to avoid memory allocation in some browsers.
  this.solution = [];
  for (var i = 0; i < depth; ++i) {
    this.solution[i] = new Move(0);
  }
}

// deepen increases the depth of this solver by 1.
Solver.prototype.deepen = function() {
  var i = this.depth;
  this.depth++;
  this.preAllocCubes[i] = new Phase1Cube();
  this.solution[i] = new Move(0);
};

// solve finds solutions for the cube.
Solver.prototype.solve = function(cube) {
  return this._search(cube, 0, 0, -1);
}

Solver.prototype._expired = function() {
  return new Date().getTime() > this.deadline;
};

Solver.prototype._search = function(cube, depth, lastFace, lastAxis) {
  if (depth === this.depth) {
    if (cube.anySolved()) {
      if (this._expired()) {
        return false;
      }
      return this.cb(this.solution.slice(), cube.copy());
    }
    return true;
  } else if (this.heuristic.lowerBound(cube) > this.depth - depth) {
    return true;
  }

  var newCube = this.preAllocCubes[depth];
  
  // The last move should not be a double turn since that would preserve the
  // phase-1 state.
  var moveCount = (depth === this.depth - 1 ? 12 : 18);
  for (var i = 0; i < moveCount; ++i) {
    var face = (i % 6) + 1;
    var axis = (face - 1) >>> 1;
    if (face === lastFace) {
      continue;
    } else if (axis === lastAxis && face >= lastFace) {
      // Avoid redundancies like L R L' and enforce an ordering (e.g. there can
      // be a solution with L R, but not one with R L).
      continue;
    }
    
    // Get the cube which results from applying the given move.
    var move = this.basis[i];
    newCube.set(cube);
    newCube.move(move, this.moves);
    
    // Recurse one level deeper, setting the move in the solution buffer.
    this.solution[depth] = move;
    if (!this._search(newCube, depth+1, face, axis)) {
      return false;
    }
    
    // this._expired allocates memory and thus consumes time. Luckily, short
    // circuit evaluation makes this a three-liner.
    if (this._depth - depth >= 7 && this._expired()) {
      return false;
    }
  }

  return true;
};

// solvePhase1 uses iterative deepening to solve the cube.
// The cb argument is a callback which receives two arguments, a solution and a
// Phase1Cube, for each solution. If the callback returns true, the search will
// continue. If it returns false, the search will stop.
// The timeout argument represents the number of milliseconds after which the
// solver should stop. This is 1000000 by default.
function solvePhase1(cube, heuristic, moves, cb, timeout) {
  var deadline = new Date().getTime() + (timeout || 1000000);
  var depth = 0;
  var solver = new Solver(heuristic, moves, cb, deadline, 0);
  while (true) {
    if (!solver.solve(cube)) {
      return;
    }
    solver.deepen();
    ++depth;
  }
}

exports.solvePhase1 = solvePhase1;
