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
  var queue = new Queue({state: new Corners(), depth: 0});
  var moves = allMoves();
  while (!queue.empty()) {
    var node = queue.shift();
    
    var idx = encodeCO(node.state);
    if (this.table[idx] >= 0) {
      continue;
    }
    this.table[idx] = node.depth;
    
    for (var i = 0, len = moves.length; i < len; ++i) {
      var newState = node.state.copy();
      newState.move(moves[i]);
      queue.push({state: newState, depth: node.depth+1});
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
  var queue = new Queue({state: new Edges(), depth: 0});
  var moves = allMoves();
  while (!queue.empty()) {
    var node = queue.shift();
    
    var idx = encodeEO(node.state);
    if (this.table[idx] >= 0) {
      continue;
    }
    this.table[idx] = node.depth;
    
    for (var i = 0, len = moves.length; i < len; ++i) {
      var newState = node.state.copy();
      newState.move(moves[i]);
      queue.push({state: newState, depth: node.depth+1});
    }
  }
};

EOHeuristic.prototype.lookup = function(cube) {
  return this.table[encodeEO(cube.edges)];
};

function EOMHeuristic(maxDepth) {
  this.maxDepth = maxDepth;
  this.table = {};
}

EOMHeuristic.prototype.generate = function() {
  // Use breadth-first search to generate a heuristic.
  var queue = new Queue({state: new Edges(), depth: 0});
  var moves = allMoves();
  while (!queue.empty()) {
    var node = queue.shift();
    
    var key = encodeEOM(node.state);
    if (this.table.hasOwnProperty(key)) {
      continue;
    }
    this.table[key] = node.depth;
    
    if (node.depth === this.maxDepth) {
      continue;
    }
    
    for (var i = 0, len = moves.length; i < len; ++i) {
      var newState = node.state.copy();
      newState.move(moves[i]);
      queue.push({state: newState, depth: node.depth+1});
    }
  }
};

EOMHeuristic.prototype.lookup = function(cube) {
  var key = encodeEOM(cube.edges);
  if (!this.table.hasOwnProperty(key)) {
    return this.maxDepth+1;
  }
  return this.table[key];
};

function MHeuristic() {
  this.table = {};
}

MHeuristic.prototype.generate = function() {
  // Use breadth-first search to generate a heuristic.
  var queue = new Queue({state: new Edges(), depth: 0});
  var moves = allMoves();
  while (!queue.empty()) {
    var node = queue.shift();
    
    var key = encodeM(node.state);
    if (this.table.hasOwnProperty(key)) {
      continue;
    }
    this.table[key] = node.depth;
    
    for (var i = 0, len = moves.length; i < len; ++i) {
      var newState = node.state.copy();
      newState.move(moves[i]);
      queue.push({state: newState, depth: node.depth+1});
    }
  }
};

MHeuristic.prototype.lookup = function(cube) {
  return this.table[encodeM(cube.edges)];
};

function P1Heuristic() {
  this.co = new COHeuristic();
  this.eo = new EOHeuristic();
  this.eom = new EOMHeuristic(5);
}

P1Heuristic.prototype.generate = function() {
  this.co.generate();
  this.eo.generate();
  this.eom.generate();
};

P1Heuristic.prototype.lookup = function(cube) {
  var a = this.co.lookup(cube);
  var b = this.eo.lookup(cube);
  var c = this.eom.lookup(cube);
  return Math.max(a, Math.max(b, c));
};

function P2CornersHeuristic() {
  this.table = {};
}

P2CornersHeuristic.prototype.generate = function() {
  // Use breadth-first search to generate a heuristic.
  var queue = new Queue({state: new Corners(), depth: 0});
  var moves = phase2Moves();
  while (!queue.empty()) {
    var node = queue.shift();
    
    var key = encodeP2Corners(node.state);
    if (this.table.hasOwnProperty(key)) {
      continue;
    }
    this.table[key] = node.depth;
    
    for (var i = 0, len = moves.length; i < len; ++i) {
      var newState = node.state.copy();
      newState.move(moves[i]);
      queue.push({state: newState, depth: node.depth+1});
    }
  }
};

P2CornersHeuristic.prototype.lookup = function(cube) {
  return this.table[encodeP2Corners(cube.corners)];
};

function P2Heuristic() {
  this.corners = new P2CornersHeuristic();
  this.edges = new P2OuterEdgesHeuristic();
}

P2Heuristic.prototype.generate = function() {
  this.corners.generate();
  this.edges.generate();
};

P2Heuristic.prototype.lookup = function(cube) {
  return Math.max(this.corners.lookup(cube), this.edges.lookup(cube));
};

function P2OuterEdgesHeuristic() {
  this.table = {};
}

P2OuterEdgesHeuristic.prototype.generate = function() {
  // Use breadth-first search to generate a heuristic.
  var queue = new Queue({state: new Edges(), depth: 0});
  var moves = phase2Moves();
  while (!queue.empty()) {
    var node = queue.shift();
    
    var key = encodeP2OuterEdges(node.state);
    if (this.table.hasOwnProperty(key)) {
      continue;
    }
    this.table[key] = node.depth;
    
    for (var i = 0, len = moves.length; i < len; ++i) {
      var newState = node.state.copy();
      newState.move(moves[i]);
      queue.push({state: newState, depth: node.depth+1});
    }
  }
};

P2OuterEdgesHeuristic.prototype.lookup = function(cube) {
  return this.table[encodeP2OuterEdges(cube.edges)];
};

function Queue(start) {
  this.first = {data: start, next: null};
  this.last = this.first;
}

Queue.prototype.empty = function() {
  return this.first === null;
};

Queue.prototype.push = function(data) {
  if (this.last !== null) {
    this.last.next = {data: data, next: null};
    this.last = this.last.next;
  } else {
    this.last = {data: data, next: null};
    this.first = this.last;
  }
};

Queue.prototype.shift = function() {
  var data = this.first.data;
  this.first = this.first.next;
  if (this.first === null) {
    this.last = null;
  }
  return data;
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

function encodeEOM(edges) {
  var sliceEdges = [0, 2, 6, 8];
  var result = "";
  for (var i = 0; i < 12; ++i) {
    var edge = edges.edges[i];
    if (sliceEdges.indexOf(edge.piece) >= 0) {
      result += (edge.flip ? "t" : "f");
    } else {
      result += (edge.flip ? "1" : "0");
    }
  }
  return result;
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

function encodeP2Corners(corners) {
  var res = "";
  for (var i = 0; i < 7; ++i) {
    res += ' ' + corners.corners[i].piece;
  }
  return res;
}

function encodeP2OuterEdges(edges) {
  var res = "";
  var indices = [1, 3, 4, 5, 7, 8, 10, 11];
  for (var i = 0; i < 8; ++i) {
    var edge = edges.edges[indices[i]];
    res += ' ' + edge.piece;
  }
  return res;
}

exports.COHeuristic = COHeuristic;
exports.EOHeuristic = EOHeuristic;
exports.EOMHeuristic = EOMHeuristic;
exports.MHeuristic = MHeuristic;
exports.P1Heuristic = P1Heuristic;
exports.P2CornersHeuristic = P2CornersHeuristic;
exports.P2Heuristic = P2Heuristic;
exports.P2OuterEdgesHeuristic = P2OuterEdgesHeuristic;
