// Phase2Heuristic estimates the lower bound for the number of moves to solve a
// Phase2Cube.
function Phase2Heuristic(moves) {
  // If an element is -1, it should be assumed to have the value 12.
  this.cornersSlice = new Int8Array(967680);
  
  // If an element is -1, it should be assumed to have the value 9.
  this.edgesSlice = new Int8Array(967680);
  
  this._generateCornersSlice(moves);
  this._generateEdgesSlice(moves);
}

// lowerBound returns a lower bound for the number of moves to solve a given
// Phase2Cube.
Phase2Heuristic.prototype.lowerBound = function(c) {
  var cMoves = this.cornersSlice[c.cornerPerm*24 + c.slicePerm];
  var eMoves = this.edgesSlice[c.edgePerm*24 + c.slicePerm];
  
  if (cMoves === -1) {
    cMoves = 12;
  }
  if (eMoves === -1) {
    eMoves = 9;
  }
  
  return Math.max(cMoves, eMoves);
};

Phase2Heuristic.prototype._generateCornersSlice = function(moves) {
  for (var i = 0; i < 967680; ++i) {
    this.cornersSlice[i] = -1;
  }
  
  var queue = new NodeQueue({corners: 0, slice: 0, hash: 0, depth: 0});
  var visited = new Uint8Array(967680);
  while (!queue.empty()) {
    var node = queue.shift();
    if (this.cornersSlice[node.hash] >= 0) {
      continue;
    }
    this.cornersSlice[node.hash] = node.depth;
    if (node.depth === 11) {
      continue;
    }
    for (var m = 0; m < 10; ++m) {
      var slice = moves.sliceMoves[node.slice*10 + m];
      var corners = moves.cornerMoves[node.corners*10 + m];
      var hash = corners*24 + slice;
      if (visited[hash] === 0) {
        queue.push({corners: corners, slice: slice, hash: hash,
          depth: node.depth + 1});
        visited[hash] = 1;
      }
    }
  }
};

Phase2Heuristic.prototype._generateEdgesSlice = function(moves) {
  for (var i = 0; i < 967680; ++i) {
    this.edgesSlice[i] = -1;
  }
  
  var queue = new NodeQueue({edges: 0, slice: 0, hash: 0, depth: 0});
  var visited = new Uint8Array(967680);
  while (!queue.empty()) {
    var node = queue.shift();
    if (this.edgesSlice[node.hash] >= 0) {
      continue;
    }
    this.edgesSlice[node.hash] = node.depth;
    if (node.depth === 8) {
      continue;
    }
    for (var m = 0; m < 10; ++m) {
      var slice = moves.sliceMoves[node.slice*10 + m];
      var edges = moves.edgeMoves[node.edges*10 + m];
      var hash = edges*24 + slice;
      if (visited[hash] === 0) {
        queue.push({edges: edges, slice: slice, hash: hash,
          depth: node.depth + 1});
        visited[hash] = 1;
      }
    }
  }
};

exports.Phase2Heuristic = Phase2Heuristic;
