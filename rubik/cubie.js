var PocketCube = includeAPI('pocketcube');
var Corner = PocketCube.Corner;
var Corners = PocketCube.Cube;

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

Cube.prototype.solved = function() {
  return this.corners.solved() && this.edges.solved();
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
  if (m.turns() === 2) {
    this.halfTurn(m.face());
  } else {
    this.quarterTurn(m.face(), m.turns());
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

Edges.prototype.solved = function() {
  for (var i = 0; i < 11; ++i) {
    var edge = this.edges[i];
    if (edge.piece !== i || edge.flip) {
      return false;
    }
  }
  return true;
};

exports.CubieCorner = Corner;
exports.CubieCorners = Corners;
exports.CubieCube = Cube;
exports.CubieEdge = Edge;
exports.CubieEdges = Edges;
