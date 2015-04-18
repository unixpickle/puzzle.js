// SHORT_LENGTH is a "good" length for a solution. A solution of SHORT_LENGTH
// should be relatively easy to find and also relatively quick to apply to a
// cube.
var SHORT_LENGTH = 21;

// SolveTables hold the move and heuristic tables for both phases of the solver.
// The default SolveTables should be acceptable for most uses.
function SolveTables(p1Moves, p1Heuristic, p2Coords, p2Heuristic) {
  this.p1Moves = p1Moves || new Phase1Moves();
  this.p1Heuristic = p1Heuristic || new Phase1Heuristic(this.p1Moves);
  this.p2Coords = p2Coords || new Phase2Coords();
  this.p2Heuristic = p2Heuristic || new Phase2Heuristic(this.p2Coords);
}

// SolveTimeouts contain basic information about how much time to spend on
// various types of solutions.
// The default SolveTimeouts will be acceptable for most purposes.
function SolveTimeouts(shortTimeout, longTimeout) {
  // shortTimeout may be falsy (i.e. 0) but still be valid, so we can't simply
  // do shortTimeout || 500.
  if ('undefined' === typeof shortTimeout) {
    shortTimeout = 500;
  }
  this.shortTimeout = shortTimeout;
  this.longTimeout = longTimeout || 10000;
}

// solveCube synchronously finds a solution to a cube given SolveTables and
// SolveTimeouts.
function solveCube(cube, tables, timeouts) {
  if ('undefined' === typeof tables) {
    tables = new SolveTables();
  }
  if ('undefined' === typeof timeouts) {
    timeouts = new SolveTimeouts();
  }

  // Attempt to find a short solution.
  if (timeouts.shortTimeout > 0) {
    var s = solveLen(cube, tables, SHORT_LENGTH, timeouts.shortTimeout);
    if (s !== null) {
      return s;
    }
  }

  // Look for longer solutions.
  return solveLen(cube, tables, 30, timeouts.longTimeout);
}

function solveLen(cube, tables, maxLen, timeout) {
  var deadline = new Date().getTime() + timeout;
  var p1Cube = new Phase1AxisCubes(cube);
  var result = null;
  solvePhase1(p1Cube, tables.p1Heuristic, tables.p1Moves, function(moves, c) {
    // Go through each axis and see if it's solved on that axis.
    var solved = c.solved();
    for (var axis = 0; axis < 3; ++axis) {
      if (!solved[axis]) {
        continue;
      }
      // Go back to the original CubieCube and apply the solution for phase-1.
      var newCube = cube.copy();
      for (var i = 0; i < moves.length; ++i) {
        newCube.move(moves[i]);
      }
      var p2Cube = convertCubieToPhase2(newCube, axis, tables.p2Coords);
      var p2Timeout = deadline - new Date().getTime();
      // Run the search
      var solution = solvePhase2(p2Cube, maxLen-moves.length,
        tables.p2Heuristic, tables.p2Coords, p2Timeout);
      if (solution !== null) {
        result = moves;
        for (var i = 0; i < solution.length; ++i) {
          result.push(p2MoveMove(solution[i], axis));
        }
        result = cancelMoves(result);
        return false;
      }
      return true;
    }
  }, timeout);
  return result;
}

exports.SolveTables = SolveTables;
exports.SolveTimeouts = SolveTimeouts;
exports.solveCube = solveCube;
