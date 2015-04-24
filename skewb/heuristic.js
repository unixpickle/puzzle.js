function Heuristic() {
  this.centerHeuristicData = makeCenterHeuristic();
  this.coHeuristicData = makeCOHeuristic();
}

Heuristic.prototype.lookup = function(state) {
  return Math.max(this.coHeuristicData[encodeCO(state.corners)],
    this.centerHeuristicData[encodeCenters(state.centers)]);
};

function encodeCO(corners) {
  var res = '';
  for (var i = 0; i < 8; ++i) {
    res += corners[i].orientation;
  }
  return res;
}

function encodeCenters(centers) {
  var res = '';
  for (var i = 0; i < 6; ++i) {
    res += centers[i];
  }
  return res;
}

function makeCOHeuristic() {
  var res = {};
  var nodes = [{state: new Skewb(), hash: encodeCO(new Skewb().corners),
    depth: 0}];
  var moves = allMoves();
  var visited = {};
  while (nodes.length > 0) {
    var node = nodes[0];
    nodes.splice(0, 1);

    // Check if the state has been visited before.
    if (res.hasOwnProperty(node.hash)) {
      continue;
    }
    res[node.hash] = node.depth;

    // Branch out.
    for (var i = 0, len = moves.length; i < len; ++i) {
      var newNode = node.state.copy();
      newNode.move(moves[i]);

      var hash = encodeCO(newNode.corners);
      if (!visited[hash]) {
        nodes.push({state: newNode, depth: node.depth+1, hash: hash});
        visited[hash] = true;
      }
    }
  }
  return res;
}

function makeCenterHeuristic() {
  var res = {};
  var nodes = [{state: new Skewb(), hash: encodeCenters(new Skewb().centers),
    depth: 0}];
  var moves = allMoves();
  var visited = {};
  while (nodes.length > 0) {
    var node = nodes[0];
    nodes.splice(0, 1);

    // Check if the state has been visited before.
    var idx = encodeCenters(node.state.centers);
    if (res.hasOwnProperty(idx)) {
      continue;
    }
    res[idx] = node.depth;

    // Branch out.
    for (var i = 0, len = moves.length; i < len; ++i) {
      var newNode = node.state.copy();
      newNode.move(moves[i]);

      var hash = encodeCenters(newNode.centers);
      if (!visited[hash]) {
        nodes.push({state: newNode, depth: node.depth+1, hash: hash});
        visited[hash] = true;
      }
    }
  }
  return res;
}

exports.Heuristic = Heuristic;
