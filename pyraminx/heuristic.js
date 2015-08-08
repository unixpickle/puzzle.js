// EdgesHeuristic determines a lower-bound for the number of moves to solve a set of Edges.
function EdgesHeuristic(maxDepth) {
  this._table = new Uint8Array(11520);
  for (var i = 0, len = this._table.length; i < len; ++i) {
    this._table[i] = maxDepth + 1;
  }

  var moves = allMoves();
  var queue = [{state: new Edges(), depth: 0}];
  while (queue.length > 0) {
    var node = queue.shift();
    var state = node.state;
    var depth = node.depth;
    var hash = state.hash();

    if (this._table[hash] <= maxDepth) {
      continue;
    }
    this._table[hash] = depth;

    if (depth !== maxDepth) {
      for (var moveIndex = 0; moveIndex < 8; ++moveIndex) {
        var newState = state.copy();
        newState.move(moves[moveIndex]);
        queue.push({state: newState, depth: depth+1});
      }
    }
  }
}

// lowerBound returns a lower bound for the number of moves to solve a set of edges.
EdgesHeuristic.prototype.lowerBound = function(edges) {
  return this._table[edges.hash()];
};

exports.EdgesHeuristic = EdgesHeuristic;
