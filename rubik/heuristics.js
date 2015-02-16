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
      continue;
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

function EOHeuristic() {
  this.table = [];
  
  // We populate the table a) so every cell is marked invalid, and b) so the
  // array doesn't become "sparse" under V8.
  for (var i = 0; i < 2048; ++i) {
    this.table[i] = -1;
  }
}

EOHeuristic.prototype.generate = function() {
  // Use breadth-first search to generate a heuristic.
  var nodes = [{state: new Edges(), depth: 0}];
  var moves = allMoves();
  while (nodes.length > 0) {
    var node = nodes[0];
    nodes.splice(0, 1);
    
    var idx = encodeEO(node.state);
    if (this.table[idx] >= 0) {
      continue;
    }
    this.table[idx] = node.depth;
    
    for (var i = 0, len = moves.length; i < len; ++i) {
      var newState = node.state.copy();
      newState.move(moves[i]);
      nodes.push({state: newState, depth: node.depth+1});
    }
  }
};

EOHeuristic.prototype.lookup = function(cube) {
  return this.table[encodeEO(cube.edges)];
};

function MHeuristic() {
  this.table = {};
}

MHeuristic.prototype.generate = function() {
  // Use breadth-first search to generate a heuristic.
  var nodes = [{state: new Edges(), depth: 0}];
  var moves = allMoves();
  while (nodes.length > 0) {
    var node = nodes[0];
    nodes.splice(0, 1);
    
    var key = encodeM(node.state);
    if (this.table.hasOwnProperty(key)) {
      continue;
    }
    this.table[key] = node.depth;
    
    for (var i = 0, len = moves.length; i < len; ++i) {
      var newState = node.state.copy();
      newState.move(moves[i]);
      nodes.push({state: newState, depth: node.depth+1});
    }
  }
};

MHeuristic.prototype.lookup = function(cube) {
  return this.table[encodeM(cube.edges)];
};

function P1Heuristic() {
  this.co = new COHeuristic();
  this.eo = new EOHeuristic();
  this.m = new MHeuristic();
}

P1Heuristic.prototype.generate = function() {
  this.co.generate();
  this.eo.generate();
  this.m.generate();
};

P1Heuristic.prototype.lookup = function(cube) {
  var a = this.co.lookup(cube);
  var b = this.eo.lookup(cube);
  var c = this.m.lookup(cube);
  return Math.max(a, Math.max(b, c));
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

function encodeEO(edges) {
  var res = 0;
  for (var i = 0; i < 11; ++i) {
    var orientation = (edges.edges[i].flip ? 1 : 0);
    res += orientation << i;
  }
  return res;
}

function encodeM(edges) {
  var sliceEdges = [0, 2, 6, 8];
  var result = "";
  for (var i = 0; i < 12; ++i) {
    var piece = edges.edges[i].piece;
    if (sliceEdges.indexOf(piece) >= 0) {
      result += "1";
    } else {
      result += "0";
    }
  }
  return result;
}

exports.COHeuristic = COHeuristic;
exports.EOHeuristic = EOHeuristic;
exports.MHeuristic = MHeuristic;
exports.P1Heuristic = P1Heuristic;
