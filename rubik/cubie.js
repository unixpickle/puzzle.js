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
  return Object.create(Corners.prototype, {corners: newCorners});
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
  var props = {edges: this.edges.copy(), corners: this.corners.copy()};
  return Object.create(Cube.prototype, props);
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
  return Object.create(Edges.prototype, {edges: newEdges});
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
