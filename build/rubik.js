// This is the compiled rubik API.
(function() {

  var exports;
  if ('undefined' !== typeof window) {
    // Browser
    if (!window.puzzlejs) {
      window.puzzlejs = {rubik: {}};
    } else if (!window.puzzlejs.rubik) {
      window.puzzlejs.rubik = {};
    }
    exports = window.puzzlejs.rubik;
  } else if ('undefined' !== typeof self) {
    // WebWorker
    if (!self.puzzlejs) {
      self.puzzlejs = {rubik: {}};
    } else if (!self.puzzlejs.rubik) {
      self.puzzlejs.rubik = {};
    }
    exports = self.puzzlejs.rubik;
  } else if ('undefined' !== typeof module) {
    // Node.js
    if (!module.exports) {
      module.exports = {};
    }
    exports = module.exports;
  }
  
  
  /**
   * A Corner stores the piece index and orientation of a corner.
   *
   * To understand the meaning of a Corner's fields, you must first
   * understand the coordinate system. There are there axes, x, y, and z.
   * The x axis is 0 at the L face and 1 at the R face.
   * The y axis is 0 at the D face and 1 at the U face.
   * The z axis is 0 at the B face and 1 at the F face.
   *
   * A corner piece's index is determined by it's original position on the
   * cube. The index is a binary number of the form ZYX, where Z is the most
   * significant digit. Thus, the BLD corner is 0, the BRU corner is 3, the
   * FRU corner is 7, etc.
   *
   * The orientation of a corner tells how it is twisted. It is an axis number
   * 0, 1, or 2 for x, y, or z respectively. It indicates the direction normal
   * to the red or orange sticker (i.e. the sticker that is usually normal to
   * the x axis).
   */
  function Corner(piece, orientation) {
    this.piece = piece;
    this.orientation = orientation;
  }
  
  Corner.prototype.copy = function() {
    return new Corner(this.piece, this.orientation);
  };
  
  /**
   * Corners represent the corners of a cube.
   */
  function Corners() {
    this.corners = [];
    for (var i = 0; i < 8; ++i) {
      this.corners[i] = new Corner(i, 0);
    }
  }
  
  Corners.prototype.copy = function() {
    var newCorners = [];
    for (var i = 0; i < 8; ++i) {
      newCorners[i] = this.corners[i].copy();
    }
    var res = Object.create(Corners.prototype);
    res.corners = newCorners;
    return res;
  };
  
  Corners.prototype.halfTurn = function(face) {
    switch (face) {
    case 1:
      var ref = this.corners[2];
      this.corners[2] = this.corners[7];
      this.corners[7] = ref;
      ref = this.corners[3];
      this.corners[3] = this.corners[6];
      this.corners[6] = ref;
      break;
    case 2:
      var ref = this.corners[0];
      this.corners[0] = this.corners[5];
      this.corners[5] = ref;
      ref = this.corners[1];
      this.corners[1] = this.corners[4];
      this.corners[4] = ref;
      break;
    case 3:
      var ref = this.corners[5];
      this.corners[5] = this.corners[6];
      this.corners[6] = ref;
      ref = this.corners[4];
      this.corners[4] = this.corners[7];
      this.corners[7] = ref;
      break;
    case 4:
      var ref = this.corners[0];
      this.corners[0] = this.corners[3];
      this.corners[3] = ref;
      ref = this.corners[1];
      this.corners[1] = this.corners[2];
      this.corners[2] = ref;
      break;
    case 5:
      var ref = this.corners[1];
      this.corners[1] = this.corners[7];
      this.corners[7] = ref;
      ref = this.corners[3];
      this.corners[3] = this.corners[5];
      this.corners[5] = ref;
      break;
    case 6:
      var ref = this.corners[0];
      this.corners[0] = this.corners[6];
      this.corners[6] = ref;
      ref = this.corners[2];
      this.corners[2] = this.corners[4];
      this.corners[4] = ref;
      break;
    default:
      break;
    }
  };
  
  Corners.prototype.move = function(m) {
    if (m.turns === 2) {
      this.halfTurn(m.face);
    } else {
      this.quarterTurn(m.face, m.turns);
    }
  };
  
  Corners.prototype.quarterTurn = function(face, turns) {
    switch (face) {
    case 1:
      if (turns === 1) {
        var ref = this.corners[6];
        this.corners[6] = this.corners[7];
        this.corners[7] = this.corners[3];
        this.corners[3] = this.corners[2];
        this.corners[2] = ref;
      } else {
        var ref = this.corners[6];
        this.corners[6] = this.corners[2];
        this.corners[2] = this.corners[3];
        this.corners[3] = this.corners[7];
        this.corners[7] = ref;
      }
      var indices = [2, 3, 6, 7];
      for (var i = 0; i < 4; ++i) {
        var idx = indices[i];
        this.corners[idx].orientation = 2 - this.corners[idx].orientation;
      }
      break;
    case 2:
      if (turns === 1) {
        var ref = this.corners[4];
        this.corners[4] = this.corners[0];
        this.corners[0] = this.corners[1];
        this.corners[1] = this.corners[5];
        this.corners[5] = ref;
      } else {
        var ref = this.corners[4];
        this.corners[4] = this.corners[5];
        this.corners[5] = this.corners[1];
        this.corners[1] = this.corners[0];
        this.corners[0] = ref;
      }
      var indices = [0, 1, 4, 5];
      for (var i = 0; i < 4; ++i) {
        var idx = indices[i];
        this.corners[idx].orientation = 2 - this.corners[idx].orientation;
      }
      break;
    case 3:
      if (turns === 1) {
        var ref = this.corners[4];
        this.corners[4] = this.corners[5];
        this.corners[5] = this.corners[7];
        this.corners[7] = this.corners[6];
        this.corners[6] = ref;
      } else {
        var ref = this.corners[6];
        this.corners[6] = this.corners[7];
        this.corners[7] = this.corners[5];
        this.corners[5] = this.corners[4];
        this.corners[4] = ref;
      }
      var indices = [4, 5, 6, 7];
      for (var i = 0; i < 4; ++i) {
        var p = this.corners[indices[i]];
        var o = p.orientation;
        if (o === 0) {
          p.orientation = 1;
        } else if (o === 1) {
          p.orientation = 0;
        }
      }
      break;
    case 4:
      if (turns === 1) {
        var ref = this.corners[0];
        this.corners[0] = this.corners[2];
        this.corners[2] = this.corners[3];
        this.corners[3] = this.corners[1];
        this.corners[1] = ref;
      } else {
        var ref = this.corners[1];
        this.corners[1] = this.corners[3];
        this.corners[3] = this.corners[2];
        this.corners[2] = this.corners[0];
        this.corners[0] = ref;
      }
      for (var i = 0; i < 4; ++i) {
        var p = this.corners[i];
        var o = p.orientation;
        if (o === 0) {
          p.orientation = 1;
        } else if (o === 1) {
          p.orientation = 0;
        }
      }
      break;
    case 5:
      if (turns === 1) {
        var ref = this.corners[5];
        this.corners[5] = this.corners[1];
        this.corners[1] = this.corners[3];
        this.corners[3] = this.corners[7];
        this.corners[7] = ref;
      } else {
        var ref = this.corners[7];
        this.corners[7] = this.corners[3];
        this.corners[3] = this.corners[1];
        this.corners[1] = this.corners[5];
        this.corners[5] = ref;
      }
      var indices = [1, 3, 5, 7];
      for (var i = 0; i < 4; ++i) {
        var p = this.corners[indices[i]];
        var o = p.orientation;
        if (o === 1) {
          p.orientation = 2;
        } else if (o === 2) {
          p.orientation = 1;
        }
      }
      break;
    case 6:
      if (turns === 1) {
        var ref = this.corners[4];
        this.corners[4] = this.corners[6];
        this.corners[6] = this.corners[2];
        this.corners[2] = this.corners[0];
        this.corners[0] = ref;
      } else {
        var ref = this.corners[0];
        this.corners[0] = this.corners[2];
        this.corners[2] = this.corners[6];
        this.corners[6] = this.corners[4];
        this.corners[4] = ref;
      }
      for (var i = 0; i < 4; ++i) {
        var p = this.corners[i * 2];
        var o = p.orientation;
        if (o === 1) {
          p.orientation = 2;
        } else if (o === 2) {
          p.orientation = 1;
        }
      }
      break;
    default:
      break;
    }
  };
  
  function Cube() {
    this.edges = new Edges();
    this.corners = new Corners();
  }
  
  Cube.prototype.copy = function() {
    var res = Object.create(Cube.prototype);
    res.edges = this.edges.copy();
    res.corners = this.corners.copy();
    return res;
  };
  
  Cube.prototype.halfTurn = function(face) {
    this.corners.halfTurn(face);
    this.edges.halfTurn(face);
  };
  
  Cube.prototype.move = function(m) {
    this.corners.move(m);
    this.edges.move(m);
  };
  
  Cube.prototype.quarterTurn = function(face, turns) {
    this.corners.quarterTurn(face, turns);
    this.edges.quarterTurn(face, turns);
  };
  
  /**
   * An Edge represents a physical edge of a cube.
   *
   * Edges are indexed from 0 through 11 in the following order:
   * UF, RF, DF, LF, UL, UR, BU, BR, BD, BL, DL, DR.
   *
   * The flip field is true if the edge is "bad" in the ZZ color scheme (i.e.
   * if it requires an F or B move to fix).
   */
  function Edge(piece, flip) {
    this.piece = piece;
    this.flip = flip;
  }
  
  Edge.prototype.copy = function() {
    return new Edge(this.piece, this.flip);
  };
  
  function Edges() {
    this.edges = [];
    for (var i = 0; i < 12; ++i) {
      this.edges[i] = new Edge(i, false);
    }
  }
  
  Edges.prototype.copy = function() {
    var newEdges = [];
    for (var i = 0; i < 12; ++i) {
      newEdges[i] = this.edges[i].copy();
    }
    var res = Object.create(Edges.prototype);
    res.edges = newEdges;
    return res;
  };
  
  Edges.prototype.halfTurn = function(face) {
    switch (face) {
    case 1:
      var ref = this.edges[0];
      this.edges[0] = this.edges[6];
      this.edges[6] = ref;
      ref = this.edges[4];
      this.edges[4] = this.edges[5];
      this.edges[5] = ref;
      break;
    case 2:
      var ref = this.edges[2];
      this.edges[2] = this.edges[8];
      this.edges[8] = ref;
      ref = this.edges[10];
      this.edges[10] = this.edges[11];
      this.edges[11] = ref;
      break;
    case 3:
      var ref = this.edges[0];
      this.edges[0] = this.edges[2];
      this.edges[2] = ref;
      ref = this.edges[1];
      this.edges[1] = this.edges[3];
      this.edges[3] = ref;
      break;
    case 4:
      var ref = this.edges[6];
      this.edges[6] = this.edges[8];
      this.edges[8] = ref;
      ref = this.edges[7];
      this.edges[7] = this.edges[9];
      this.edges[9] = ref;
      break;
    case 5:
      var ref = this.edges[1];
      this.edges[1] = this.edges[7];
      this.edges[7] = ref;
      ref = this.edges[5];
      this.edges[5] = this.edges[11];
      this.edges[11] = ref;
      break;
    case 6:
      var ref = this.edges[3];
      this.edges[3] = this.edges[9];
      this.edges[9] = ref;
      ref = this.edges[4];
      this.edges[4] = this.edges[10];
      this.edges[10] = ref;
      break;
    default:
      break;
    }
  };
  
  Edges.prototype.move = function(m) {
    if (m.turns === 2) {
      this.halfTurn(m.face);
    } else {
      this.quarterTurn(m.face, m.turns);
    }
  };
  
  Edges.prototype.quarterTurn = function(face, turns) {
    switch (face) {
    case 1:
      if (turns === 1) {
        var ref = this.edges[5];
        this.edges[5] = this.edges[6];
        this.edges[6] = this.edges[4];
        this.edges[4] = this.edges[0];
        this.edges[0] = ref;
      } else {
        var ref = this.edges[0];
        this.edges[0] = this.edges[4];
        this.edges[4] = this.edges[6];
        this.edges[6] = this.edges[5];
        this.edges[5] = ref;
      }
      break;
    case 2:
      if (turns === 1) {
        var ref = this.edges[10];
        this.edges[10] = this.edges[8];
        this.edges[8] = this.edges[11];
        this.edges[11] = this.edges[2];
        this.edges[2] = ref;
      } else {
        var ref = this.edges[2];
        this.edges[2] = this.edges[11];
        this.edges[11] = this.edges[8];
        this.edges[8] = this.edges[10];
        this.edges[10] = ref;
      }
      break;
    case 3:
      if (turns === 1) {
        var ref = this.edges[3];
        this.edges[3] = this.edges[2];
        this.edges[2] = this.edges[1];
        this.edges[1] = this.edges[0];
        this.edges[0] = ref;
      } else {
        var ref = this.edges[0];
        this.edges[0] = this.edges[1];
        this.edges[1] = this.edges[2];
        this.edges[2] = this.edges[3];
        this.edges[3] = ref;
      }
      for (var i = 0; i < 4; ++i) {
        this.edges[i].flip = !this.edges[i].flip;
      }
      break;
    case 4:
      if (turns === 1) {
        var ref = this.edges[7];
        this.edges[7] = this.edges[8];
        this.edges[8] = this.edges[9];
        this.edges[9] = this.edges[6];
        this.edges[6] = ref;
      } else {
        var ref = this.edges[6];
        this.edges[6] = this.edges[9];
        this.edges[9] = this.edges[8];
        this.edges[8] = this.edges[7];
        this.edges[7] = ref;
      }
      for (var i = 6; i < 10; ++i) {
        this.edges[i].flip = !this.edges[i].flip;
      }
      break;
    case 5:
      if (turns === 1) {
        var ref = this.edges[11];
        this.edges[11] = this.edges[7];
        this.edges[7] = this.edges[5];
        this.edges[5] = this.edges[1];
        this.edges[1] = ref;
      } else {
        var ref = this.edges[1];
        this.edges[1] = this.edges[5];
        this.edges[5] = this.edges[7];
        this.edges[7] = this.edges[11];
        this.edges[11] = ref;
      }
      break;
    case 6:
      if (turns === 1) {
        var ref = this.edges[4];
        this.edges[4] = this.edges[9];
        this.edges[9] = this.edges[10];
        this.edges[10] = this.edges[3];
        this.edges[3] = ref;
      } else {
        var ref = this.edges[3];
        this.edges[3] = this.edges[10];
        this.edges[10] = this.edges[9];
        this.edges[9] = this.edges[4];
        this.edges[4] = ref;
      }
      break;
    default:
      break;
    }
  };
  
  exports.CubieCorner = Corner;
  exports.CubieCorners = Corners;
  exports.CubieCube = Cube;
  exports.CubieEdge = Edge;
  exports.CubieEdges = Edges;
  
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
  
  exports.COHeuristic = COHeuristic;
  exports.EOHeuristic = EOHeuristic;
  exports.EOMHeuristic = EOMHeuristic;
  exports.MHeuristic = MHeuristic;
  exports.P1Heuristic = P1Heuristic;
  
  var _allMovesList;
  
  function Move(face, turns) {
    this.face = face;
    this.turns = turns;
  }
  
  Move.prototype.axis = function() {
    return [-1, 1, 1, 2, 2, 0, 0][this.face];
  };
  
  Move.prototype.inverse = function() {
    if (this.turns === 2) {
      return this;
    } else {
      return new Move(this.face, -this.turns);
    }
  };
  
  Move.prototype.toString = function() {
    var faces = 'UDFBRL';
    var face = faces[this.face - 1];
    if (this.turns === 1) {
      return face;
    } else if (this.turns === 2) {
      return face + '2';
    } else {
      return face + "'";
    }
  };
  
  function allMoves() {
    // The moves are ordered in descending comfort.
    return _allMovesList.slice();
  }
  
  function movesToString(moves) {
    return moves.join(' ');
  }
  
  function parseMove(s) {
    if (s.length === 1) {
      var faces = ['U', 'D', 'F', 'B', 'R', 'L'];
      var face = faces.indexOf(s);
      if (face < 0) {
        throw new Error('Invalid move: ' + s);
      }
      return new Move(face+1, 1);
    } else if (s.length === 2) {
      var res = parseMove(s[0]);
      if (s[1] === '2') {
        res.turns = 2;
      } else if (s[1] === "'") {
        res.turns = -1;
      } else {
        throw new Error('Invalid move: ' + s);
      }
      return res;
    } else {
      throw new Error('Invalid move: ' + s);
    }
  }
  
  function parseMoves(s) {
    var parts = s.split(' ');
    var res = [];
    for (var i = 0, len = parts.length; i < len; ++i) {
      res[i] = parseMove(parts[i]);
    }
    return res;
  }
  
  function scrambleMoves(len) {
    var axis = -1;
    var moves = allMoves();
    var result = [];
    
    for (var i = 0; i < len; ++i) {
      // Pick a random move
      var moveIdx = Math.floor(Math.random() * moves.length);
      var move = moves[moveIdx];
      
      // Reset the moves and the axis if necessary.
      if (move.axis() !== axis) {
        axis = move.axis();
        moves = allMoves();
      }
      
      // Remove all moves which affect this face
      for (var j = 0; j < moves.length; ++j) {
        if (moves[j].face === move.face) {
          moves.splice(j, 1);
          --j;
        }
      }
      
      result[i] = move;
    }
    
    return result;
  }
  
  // Generate a list of every move, ordered by comfort.
  _allMovesList = parseMoves("R R' L L' U U' D D' R2 L2 U2 D2 F2 B2 F " +
    "F' B B'");
  
  exports.Move = Move;
  exports.allMoves = allMoves;
  exports.movesToString = movesToString;
  exports.parseMove = parseMove;
  exports.parseMoves = parseMoves;
  exports.scrambleMoves = scrambleMoves;
  
  function phase1Search(cube, heuristic, moves, depth, cb) {
    // If we are done, check if it's solved and run the callback.
    if (moves.length === depth) {
      if (!phase1Solved(cube)) {
        return true;
      }
      if (cb(moves.slice()) === true) {
        return true;
      } else {
        return false;
      }
    }
    
    // Check the heuristic.
    if (heuristic.lookup(cube) > depth-moves.length) {
      return true;
    }
    
    // Apply each move and go deeper.
    var turns = allMoves();
    for (var i = 0, len = turns.length; i < len; ++i) {
      var newState = cube.copy();
      newState.move(turns[i]);
      moves.push(turns[i]);
      if (!phase1Search(newState, heuristic, moves, depth, cb)) {
        return false;
      }
      moves.splice(moves.length-1, 1);
    }
    return true;
  }
  
  function phase1Solved(cube) {
    // All corners must be oriented.
    for (var i = 0; i < 7; ++i) {
      if (cube.corners.corners[i].orientation !== 0) {
        return false;
      }
    }
    
    // All edges must be oriented.
    for (var i = 0; i < 11; ++i) {
      if (cube.edges.edges[i].flip) {
        return false;
      }
    }
    
    // All slice edges must be on M slice.
    var sliceEdges = [0, 2, 6, 8];
    for (var i = 0; i < 4; ++i) {
      var piece = cube.edges.edges[sliceEdges[i]].piece;
      if (sliceEdges.indexOf(piece) < 0) {
        return false;
      }
    }
    
    return true;
  }
  
  function solvePhase1(cube, heuristic, cb) {
    for (var depth = 0; depth < 20; ++depth) {
      if (!phase1Search(cube, heuristic, [], depth, cb)) {
        break;
      }
    }
  }
  
  exports.phase1Solved = phase1Solved;
  exports.solvePhase1 = solvePhase1;
  

})();
