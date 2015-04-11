// Phase1Heuristic stores the data needed to effectively prune the search for a
// solution for phase-1.
function Phase1Heuristic(moves) {
  this.co = new Int8Array(2187);
  this.eoSlice = new Int8Array(1013760);
  
  this._computeCO(moves);
  this._computeEOSlice(moves);
}

// lowerBound returns the minimum number of moves needed to solve at least one
// phase-1 axis.
Phase1Heuristic.prototype.lowerBound = function(c) {
  var slice0 = this.eoSlice[c.mSlice*2048 + c.xEO()];
  var slice1 = this.eoSlice[c.eSlice*2048 + c.fbEO];
  var slice2 = this.eoSlice[c.sSlice*2048 + c.udEO];
  var co0 = this.co[c.xCO];
  var co1 = this.co[c.yCO];
  var co2 = this.co[c.zCO];
  
  // The slice heuristic is not complete; a value of -1 means depth 8.
  if (slice0 < 0) {
    slice0 = 8;
  }
  if (slice1 < 0) {
    slice1 = 8;
  }
  if (slice2 < 0) {
    slice2 = 8;
  }
  
  return Math.min(Math.max(slice0, co0), Math.max(slice1, co1),
    Math.max(slice2, co2));
};

// _computeCO generates the CO table.
Phase1Heuristic.prototype._computeCO = function(moves) {
  for (var i = 0; i < 2187; ++i) {
    this.co[i] = -1;
  }
  
  // Each node is encoded as follows:
  // (LSB) (4 bits: depth) (12 bits: corner orientations)
  
  // Create the queue with the starting node. This queue never needs more than
  // 1285 nodes at once (a number I found empirically).
  var queue = new NumberQueue(1285);
  queue.push(1093 << 4);
  
  // We have visited the starting node.
  this.co[1093] = 0;
  
  while (!queue.empty()) {
    // Shift a node and extract its fields.
    var node = queue.shift();
    var depth = node & 0xf;
    var co = node >>> 4;
    
    // Apply moves to the state.
    for (var i = 0; i < 18; ++i) {
      var newCO = moves.co[co*18 + i];
      if (this.co[newCO] < 0) {
        this.co[newCO] = depth + 1;
        queue.push((depth + 1) | (newCO << 4));
      }
    }
  }
};

// _computeEOSlice generates the EOSlice table.
Phase1Heuristic.prototype._computeEOSlice = function(moves) {
  for (var i = 0; i < 1013760; ++i) {
    this.eoSlice[i] = -1;
  }
  
  // Each node is encoded as follows:
  // (LSB) (3 bits: depth) (11 bits: EO) (9 bits: slice)
  
  // States are hashed for eoSlice as follows:
  // (slice << 11) | EO.
  // In other words, shifting the node to the right by 3 bits gives you the hash
  // for that node (although I never actually use this, lol).
  
  // Generate the queue with the starting node. I have found empirically that
  // there are never more than 238263 nodes in the queue.
  var queue = new NumberQueue(238263);
  queue.push(220 << 14);
  
  // We have visited the first node.
  this.eoSlice[220 << 11] = 0;
  
  while (!queue.empty()) {
    // Shift the node and extract its bitfields.
    var node = queue.shift();
    var depth = node & 0x7;
    var eo = (node >>> 3) & 0x7ff;
    var slice = (node >>> 14);
    
    // Apply each move to the node.
    for (var i = 0; i < 18; ++i) {
      var newEO = moves.eo[eo*18 + i];
      var newSlice = moves.slice[slice*18 + i];
      var hash = (newSlice << 11) | newEO;
      if (this.eoSlice[hash] < 0) {
        this.eoSlice[hash] = depth + 1;
        if (depth < 6) {
          queue.push((depth + 1) | (hash << 3));
        }
      }
    }
  }
};

exports.Phase1Heuristic = Phase1Heuristic;
