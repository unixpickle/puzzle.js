function Solver(heuristic, moves, cb, deadline) {
  this.heuristic = heuristic;
  this.moves = moves;
  this.cb = cb;
  this.deadline = deadline;
}

Solver.prototype.solve = function(cube, preMoves, depth, lastFace) {
  if (depth === 0) {
    if (cube.anySolved()) {
      if (this._expired()) {
        return false;
      }
      return this.cb(preMoves.slice(), cube);
    }
    return true;
  } else if (this.heuristic.lowerBound(cube) > depth) {
    return true;
  }

  for (var i = 0; i < 18; ++i) {
    var move = new Move(i);
    if (move.face() === lastFace) {
      continue;
    }
    var newCube = cube.copy();
    newCube.move(move, this.moves);
    preMoves.push(move);
    if (!this.solve(newCube, preMoves, depth-1, move.face())) {
      return false;
    }
    preMoves.pop();
    if (depth >= 7 && this._expired()) {
      return false;
    }
  }

  return true;
};

Solver.prototype._expired = function() {
  return new Date().getTime() > this.deadline;
};

function solvePhase1(cube, heuristic, moves, cb, timeout) {
  var solver = new Solver(heuristic, moves, cb, new Date().getTime() + timeout);
  var depth = 0;
  while (true) {
    if (!solver.solve(cube, [], depth, 0)) {
      return;
    }
    ++depth;
  }
}

exports.solvePhase1 = solvePhase1;
