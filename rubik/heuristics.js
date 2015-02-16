function COHeuristic() {
  this.table = [];
  
  // We populate the table a) so every cell is marked invalid, and b) so the
  // array doesn't become "sparse" under V8.
  for (var i = 0; i < 2187; ++i) {
    this.table[i] = -1;
  }
}

COHeuristic.prototype.generate = function() {
  // Use breadth-first search to generate a heuristic.
  var nodes = [{state: new Corners(), depth: 0}];
  var moves = allMoves();
  while (nodes.length > 0) {
    var node = nodes[0];
    nodes.splice(0, 1);
    
    var idx = encodeCO(node.state);
    if (this.table[idx] >= 0) {
      continue
    }
    this.table[idx] = node.depth;
    
    for (var i = 0, len = moves.length; i < len; ++i) {
      var newState = node.state.copy();
      newState.move(moves[i]);
      nodes.push({state: newState, depth: node.depth+1});
    }
  }
};

COHeuristic.prototype.lookup = function(cube) {
  return this.table[encodeCO(cube.corners)];
};

function encodeCO(corners) {
  var res = 0;
  var mul = 1;
  for (var i = 0; i < 7; ++i) {
    res += mul * corners.corners[i].orientation;
    mul *= 3;
  }
  return res;
}

exports.COHeuristic = COHeuristic;
