// PHASE1_CO_EO_DEPTH is the maximum depth which will be found in the COEO
// pruning table. This is not as high as it could be; it is optimized to avoid
// searching the entire space while still searching most of it.
var PHASE1_CO_EO_DEPTH = 8;

// PHASE1_EO_SLICE_DEPTH is the maximum depth which will be found in the EOSLICE
// pruning table. See PHASE1_CO_EO_DEPTH for more.
var PHASE1_EO_SLICE_DEPTH = 8;

// Phase1Heuristic stores the data needed to effectively prune the search for a
// solution for phase-1.
function Phase1Heuristic(moves) {
  this.coEO = new CompactTable(PHASE1_CO_COUNT * PHASE1_EO_COUNT);
  this.eoSlice = new CompactTable(PHASE1_SLICE_COUNT * PHASE1_EO_COUNT);  
  this._computeCOEO(moves);
  this._computeEOSlice(moves);
}

// lowerBound returns the minimum number of moves needed to solve at least one
// phase-1 axis.
Phase1Heuristic.prototype.lowerBound = function(c) {
  var slice0 = this.eoSlice.get(c.xEO | (c.mSlice << 11));
  var slice1 = this.eoSlice.get(c.yEO | (c.eSlice << 11));
  var slice2 = this.eoSlice.get(c.zEO | (c.sSlice << 11));
  var eo0 = this.coEO.get(c.xEO | (c.xCO << 11));
  var eo1 = this.coEO.get(c.yEO | (c.yCO << 11));
  var eo2 = this.coEO.get(c.zEO | (c.zCO << 11));
  
  // Return the least of the three heuristic values.
  var a = Math.max(slice0, eo0);
  var b = Math.max(slice1, eo1);
  var c = Math.max(slice2, eo2);
  if (b < a) {
    return Math.min(b, c);
  } else {
    return Math.min(a, c);
  }
  
  // NOTE: using Math.min() with three arguments might slow down v8 since it
  // doesn't like polymorphic functions.
  // return Math.min(Math.max(slice0, eo0), Math.max(slice1, eo1),
  //   Math.max(slice2, eo2));
};

// _computeCOEO generates the CO+EO table.
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
