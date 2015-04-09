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
  var nodes = new NodeQueue({co: 1093, depth: 0, next: null});
  var visited = new Uint8Array(2187);
  while (!nodes.empty()) {
    var node = nodes.shift();
    if (this.co[node.co] !== -1) {
      continue;
    }
    this.co[node.co] = node.depth;
    for (var i = 0; i < 18; ++i) {
      var applied = moves.co[node.corners*18 + i];
      if (visited[applied] === 0) {
        visited[applied] = 1;
        nodes.push({co: applied, depth: node.depth + 1, next: null});
      }
    }
  }
};

// _computeEOSlice generates the EOSlice table.
Phase1Heuristic.prototype._computeEOSlice = function(moves) {
  for (var i = 0; i < 1013760; ++i) {
    this.eoSlice[i] = -1;
  }
  var nodes = new NodeQueue({eo: 0, slice: 220, depth: 0, hash: 220 * 2048,
    next: null});
  var visited = new Uint8Array(1013760);
  while (!nodes.empty()) {
    var node = nodes.shift();
    if (this.eoSlice[node.hash] !== -1) {
      continue;
    }
    this.eoSlice[node.hash] = node.depth;
    if (node.depth === 7) {
      continue;
    }
    for (var i = 0; i < 18; ++i) {
      var newEO = moves.eo[node.eo*18 + i];
      var newSlice = moves.slice[node.slice*18 + i];
      var hash = newSlice*2048 + newEO;
      if (visited[hash] === 0) {
        visited[hash] = 1;
        nodes.push({eo: newEO, slice: newSlice, hash: hash,
          depth: node.depth + 1, next: null});
      }
    }
  }
};

exports.Phase1Heuristic = Phase1Heuristic;
