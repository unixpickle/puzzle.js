// Phase2Heuristic estimates the lower bound for the number of moves to solve a
// Phase2Cube.
function Phase2Heuristic(moves) {
  // This stores the number of moves needed to solve both the corners and the
  // E slice edges for each case. The cases are encoded as:
  // CornerPerm*24 + SlicePerm.
  this.cornersSlice = new CompactTable(967680);
  
  // This stores the number of moves needed to solve both the edges and the E
  // slice edges for each case. The cases are encoded as:
  // EdgePerm*24 + SlicePerm.
  this.edgesSlice = new CompactTable(967680);
  
  this._generateCornersSlice(moves);
  this._generateEdgesSlice(moves);
}

// lowerBound returns a lower bound for the number of moves to solve a given
// Phase2Cube.
Phase2Heuristic.prototype.lowerBound = function(c) {
  var cMoves = this.cornersSlice.get(c.cornerPerm*24 + c.slicePerm);
  var eMoves = this.edgesSlice.get(c.edgePerm*24 + c.slicePerm);
  return Math.max(cMoves, eMoves);
};

Phase2Heuristic.prototype._generateCornersSlice = function(moves) {
  // We will never explore up to depth 12, so we set every depth to 12.
  this.cornersSlice.fillWith(12);
  
  // The arrangement of bits in the queue's nodes are as follows:
  // (LSB) (4 bits: depth) (5 bits: slice) (20 bits: corners) (MSB)
  
  // Setup the queue to have the start node. I found empirically that the queue
  // will never have more than 201210 nodes.
  var queue = new NumberQueue(201210);
  queue.push(0);
  
  // We have explored the start node. It's depth is zero (obviously).
  this.cornersSlice.set(0, 0);
  
  // While there's still stuff in the queue, do the search.
  while (!queue.empty()) {
    // Shift a node and extract its bitfields.
    var node = queue.shift();
    var depth = (node & 0xf);
    var slice = (node >>> 4) & 0x1f;
    var corners = (node >>> 9);
    
    // Apply all 10 moves to the node.
    for (var m = 0; m < 10; ++m) {
      var newSlice = moves.sliceMoves[slice*10 + m];
      var newCorners = moves.cornerMoves[corners*10 + m];
      var hash = newCorners*24 + newSlice;
      
      // If this node has not been visited, push it to the queue.
      if (this.cornersSlice.get(hash) === 12) {
        this.cornersSlice.set(hash, depth + 1);
        if (depth < 10) {
          queue.push((depth + 1) | (newSlice << 4) | (newCorners << 9));
        }
      }
    }
  }
};

Phase2Heuristic.prototype._generateEdgesSlice = function(moves) {
  // We will never search to depth 9.
  this.edgesSlice.fillWith(9);
  
  // The arrangement of bits in the queue's nodes are as follows:
  // (LSB) (4 bits: depth) (5 bits: slice) (20 bits: edges) (MSB)
  
  // Setup the queue to have the start node. I found that there will never be
  // more than 290813 nodes in the queue.
  var queue = new NumberQueue(290813);
  queue.push(0);
  
  // We have visited the first node.
  this.edgesSlice.set(0, 0);
  
  while (!queue.empty()) {
    // Shift a node and extract its bitfields.
    var node = queue.shift();
    var depth = (node & 0xf);
    var slice = (node >>> 4) & 0x1f;
    var edges = (node >>> 9);
    
    // Apply all 10 moves to the node.
    for (var m = 0; m < 10; ++m) {
      var newSlice = moves.sliceMoves[slice*10 + m];
      var newEdges = moves.edgeMoves[edges*10 + m];
      var hash = newEdges*24 + newSlice;
      
      // If this node has not been visited, push it to the queue.
      if (this.edgesSlice.get(hash) === 9) {
        this.edgesSlice.set(hash, depth + 1);
        if (depth < 7) {
          queue.push((depth + 1) | (newSlice << 4) | (newEdges << 9));
        }
      }
    }
  }
};

exports.Phase2Heuristic = Phase2Heuristic;
