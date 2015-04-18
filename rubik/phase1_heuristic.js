// PHASE1_CO_EO_DEPTH is the maximum depth which will be found in the COEO
// pruning table. This is not as high as it could be; it is optimized to avoid
// searching the entire space while still searching most of it.
var PHASE1_CO_EO_DEPTH = 8;

// PHASE1_EO_SLICE_DEPTH is the maximum depth which will be found in the EOSLICE
// pruning table. See PHASE1_CO_EO_DEPTH for more.
var PHASE1_EO_SLICE_DEPTH = 8;

// Phase1Heuristic prunes a phase-1 search.
function Phase1Heuristic(moves) {
  this.coEO = new CompactTable(PHASE1_CO_COUNT * PHASE1_EO_COUNT);
  this.eoSlice = new CompactTable(PHASE1_SLICE_COUNT * PHASE1_EO_COUNT);
  
  this._computeCOEO(moves);
  this._computeEOSlice(moves);
}

// axisLowerBound returns a lower bound for the number of moves needed to solve
// a Phase1Cube.
Phase1Heuristic.prototype.axisLowerBound = function(c) {
  var slice = this.eoSlice.get(c.eo | (c.slice << 11));
  var eo = this.coEO.get(c.eo | (c.co << 11));
  return Math.max(slice, eo);
};

// shouldPrune takes a Phase1AxisCubes and a number and returns true if the cube
// definitely cannot be solved within that number of moves.
Phase1Heuristic.prototype.shouldPrune = function(c, depth) {
  if (this.axisLowerBound(c.x) < depth) {
    return false;
  } else if (this.axisLowerBound(c.y) < depth) {
    return false;
  } else if (this.axisLowerBound(c.z) < depth) {
    return false;
  } else {
    return true;
  }
};

Phase1Heuristic.prototype._computeCOEO = function(moves) {
  // The number 549711 was found emperically and does not seem to belong in a
  // global constant because it is so specific to the implementation of
  // makePhase1EOHeuristic.
  makePhase1EOHeuristic(549711, PHASE1_SOLVED_CO, PHASE1_CO_EO_DEPTH,
    this.coEO, moves.eo, moves.co);
};

// _computeEOSlice generates the EOSlice table.
Phase1Heuristic.prototype._computeEOSlice = function(moves) {
  // For info on the number 238263, see the comment in _computeCOEO.
  makePhase1EOHeuristic(238263, PHASE1_SOLVED_SLICE, PHASE1_EO_SLICE_DEPTH,
    this.eoSlice, moves.eo, moves.slice);
};

// makePhase1Heuristic generates a heuristic which is composed of edge
// orientations combined with some other coordinate.
function makePhase1EOHeuristic(queueCap, otherStart, maxDepth, table, eoMoves,
                               otherMoves) {
  // Some info on bitfields might help you:
  // A hash is computed as: EO | (otherCoord << 11).
  // A search node is computed as: depth | (hash << 4).
  
  table.fillWith(maxDepth);
  table.set(otherStart << 11, 0);
  
  var queue = new NumberQueue(queueCap);
  queue.push(otherStart << 15);
  
  while (!queue.empty()) {
    var node = queue.shift();
    var depth = node & 0xf;
    var eo = (node >>> 4) & 0x7ff;
    var other = (node >>> 15);
    
    for (var move = 0; move < 18; ++move) {
      var newEO = eoMoves[eo*18 + move];
      var newOther = otherMoves[other*18 + move];
      var hash = (newOther << 11) | newEO;
      if (table.get(hash) === maxDepth) {
        table.set(hash, depth + 1);
        if (depth < maxDepth-2) {
          queue.push((depth + 1) | (hash << 4));
        }
      }
    }
  }
}

exports.Phase1Heuristic = Phase1Heuristic;
