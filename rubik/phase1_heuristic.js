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
  var result = 127;
  
  // The coordinates for each of the three axes.
  var sliceValues = [
    c.mSlice*2048 + c.xEO(),
    c.eSlice*2048 + c.fbEO,
    c.sSlice*2048 + c.udEO
  ];
  var coValues = [c.xCO, c.yCO, c.zCO];
  
  // Go through each axis and check the heuristic value.
  for (var axis = 0; axis < 3; ++axis) {
    var coRes = this.co[coValues[axis]];
    var sliceRes = this.eoSlice[sliceValues[axis]];
    if (sliceRes < 0) {
      sliceRes = 8;
    }
    result = Math.min(result, Math.max(sliceRes, coRes));
  }
  
  return result;
};

// _computeCO generates the CO table.
Phase1Heuristic.prototype._computeCO = function(moves) {
  for (var i = 0; i < 2187; ++i) {
    this.co[i] = -1;
  }
  var nodes = [{co: 1093, depth: 0}];
  var visited = new Uint8Array(2187);
  while (nodes.length > 0) {
    var node = nodes.shift();
    if (this.co[node.co] !== -1) {
      continue;
    }
    this.co[node.co] = node.depth;
    for (var i = 0; i < 18; ++i) {
      var applied = moves.co[node.corners*18 + i];
      if (visited[applied] === 0) {
        visited[applied] = 1;
        nodes.push({co: applied, depth: node.depth + 1});
      }
    }
  }
};

// _computeEOSlice generates the EOSlice table.
Phase1Heuristic.prototype._computeEOSlice = function(moves) {
  for (var i = 0; i < 1013760; ++i) {
    this.eoSlice[i] = -1;
  }
  var nodes = [{eo: 0, slice: 220, depth: 0, hash: 220 * 2048}];
  var visited = new Uint8Array(1013760);
  while (nodes.length > 0) {
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
        nodes.push({eo: newEO, co: newEO, hash: hash, depth: node.depth + 1});
      }
    }
  }
};

exports.Phase1Heuristic = Phase1Heuristic;
