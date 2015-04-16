// Phase2Heuristic estimates the lower bound for the number of moves to solve a
// Phase2Cube.
function Phase2Heuristic(coords) {
  // This stores the number of moves needed to solve both the corners and the
  // E slice edges for each case. The cases are encoded as:
  // CornerSym*24 + SlicePerm.
  this.cornersSlice = new CompactTable(2768 * 24);
  
  // This stores the number of moves needed to solve the edges and to bring all
  // the top-layer edges to the top layer.
  this.edgesChoose = new CompactTable(2768 * 70);
  
  // This stores the number of moves needed to solve both the edges and the E
  // slice edges for each case. The cases are encoded as:
  // EdgeSym*24 + SlicePerm.
  this.edgesSlice = new CompactTable(2768 * 24);
  
  this._generateCornersSlice(coords);
  this._generateEdgesChoose(coords);
  this._generateEdgesSlice(coords);
}

// lowerBound returns a lower bound for the number of moves to solve a given
// Phase2Cube. This requires a Phase2Coords table.
Phase2Heuristic.prototype.lowerBound = function(c, coords) {
  // Figure out the edge+slice heuristic coordinate.
  var eHash = hashEdgesSlice(c.edgeCoord, c.sliceCoord, coords);
  var eMoves = this.edgesSlice.get(eHash);

  // Figure out the corner+slice heuristic coordinate.
  var cHash = hashCornersSlice(c.cornerCoord, c.sliceCoord, coords);
  var cMoves = this.cornersSlice.get(cHash);
  
  // Figure out the edge+choose heuristic coordinate.
  var ecHash = hashEdgesChoose(c.edgeCoord, c.chooseCoord, coords);
  var ecMoves = this.edgesChoose.get(ecHash);

  return Math.max(ecMoves, Math.max(cMoves, eMoves));
};

Phase2Heuristic.prototype._generateCornersSlice = function(coords) {
  var maxDepth = 12;
  this.cornersSlice.fillWith(maxDepth);
  
  // The arrangement of bits in the queue's nodes are as follows:
  // (LSB) (4 bits: depth) (5 bits: slice) (12 bits: corners) (MSB)
  
  // Setup the queue to have the start node.
  var queue = new NumberQueue(13590);
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
      var newSlice = coords.slice.move(slice, m);
      var newCorners = coords.corners.move(corners << 4, m);
      var symSlice = coords.slice.invConjSym(newCorners & 0xf, newSlice);
      var symCorners = (newCorners >>> 4);
      hash = symSlice + symCorners*24;
      
      // If this node has not been visited, push it to the queue.
      if (this.cornersSlice.get(hash) === maxDepth) {
        this.cornersSlice.set(hash, depth + 1);
        if (depth < maxDepth-2) {
          queue.push((depth + 1) | (symSlice << 4) | (symCorners << 9));
        }
      }
    }
  }
};

Phase2Heuristic.prototype._generateEdgesChoose = function(coords) {
  var maxDepth = 10;
  this.edgesChoose.fillWith(maxDepth);
  
  // The arrangement of bits in the queue's nodes are as follows:
  // (LSB) (4 bits: depth) (7 bits: choose) (12 bits: edges) (MSB)
  
  // Setup the queue to have the start node.
  var queue = new NumberQueue(46680);
  queue.push(60 << 4);
  
  // We have visited the first node.
  this.edgesChoose.set(60, 0);

  while (!queue.empty()) {
    // Shift a node and extract its bitfields.
    var node = queue.shift();
    var depth = (node & 0xf);
    var choose = (node >>> 4) & 0x7f;
    var edges = (node >>> 11);
    
    // Apply all 10 moves to the node.
    for (var m = 0; m < 10; ++m) {
      var newChoose = coords.choose.move(choose, m);
      var newEdges = coords.edges.move(edges << 4, m);
      var symChoose = coords.choose.invConjSym(newEdges & 0xf, newChoose);
      var symEdges = (newEdges >>> 4);
      hash = symChoose + symEdges*70;
      
      // If this node has not been visited, push it to the queue.
      if (this.edgesChoose.get(hash) === maxDepth) {
        this.edgesChoose.set(hash, depth + 1);
        if (depth < maxDepth-2) {
          queue.push((depth + 1) | (symChoose << 4) | (symEdges << 11));
        }
      }
    }
  }
};

Phase2Heuristic.prototype._generateEdgesSlice = function(coords) {
  var maxDepth = 9;
  this.edgesSlice.fillWith(maxDepth);
  
  // The arrangement of bits in the queue's nodes are as follows:
  // (LSB) (4 bits: depth) (5 bits: slice) (12 bits: edges) (MSB)
  
  // Setup the queue to have the start node.
  var queue = new NumberQueue(19350);
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
      var newSlice = coords.slice.move(slice, m);
      var newEdges = coords.edges.move(edges << 4, m);
      var symSlice = coords.slice.invConjSym(newEdges & 0xf, newSlice);
      var symEdges = (newEdges >>> 4);
      hash = symSlice + symEdges*24;
      
      // If this node has not been visited, push it to the queue.
      if (this.edgesSlice.get(hash) === maxDepth) {
        this.edgesSlice.set(hash, depth + 1);
        if (depth < maxDepth-2) {
          queue.push((depth + 1) | (symSlice << 4) | (symEdges << 9));
        }
      }
    }
  }
};

function hashCornersSlice(corners, slice, coords) {
  var symSlice = coords.slice.invConjSym(corners & 0xf, slice);
  var symCorners = (corners >>> 4);
  return symSlice + symCorners*24;
}

function hashEdgesChoose(edges, choose, coords) {
  var symChoose = coords.choose.invConjSym(edges & 0xf, choose);
  var symEdges = (edges >>> 4);
  return symChoose + symEdges*70;
}

function hashEdgesSlice(edges, slice, coords) {
  var symSlice = coords.slice.invConjSym(edges & 0xf, slice);
  var symEdges = (edges >>> 4);
  return symSlice + symEdges*24;
}

exports.Phase2Heuristic = Phase2Heuristic;
