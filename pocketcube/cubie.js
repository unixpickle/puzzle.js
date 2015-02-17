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
 * Cube represent the corners of a cube.
 */
function Cube() {
  this.corners = [];
  for (var i = 0; i < 8; ++i) {
    this.corners[i] = new Corner(i, 0);
  }
}

Cube.prototype.copy = function() {
  var newCube = [];
  for (var i = 0; i < 8; ++i) {
    newCube[i] = this.corners[i].copy();
  }
  var res = Object.create(Cube.prototype);
  res.corners = newCube;
  return res;
};

Cube.prototype.halfTurn = function(face) {
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

Cube.prototype.move = function(m) {
  if (m.turns === 2) {
    this.halfTurn(m.face);
  } else {
    this.quarterTurn(m.face, m.turns);
  }
};

Cube.prototype.quarterTurn = function(face, turns) {
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

Cube.prototype.solved = function() {
  for (var i = 0; i < 7; ++i) {
    var corner = this.corners[i];
    if (corner.piece !== i || corner.orientation !== 0) {
      return false;
    }
  }
  return true;
};

exports.Corner = Corner;
exports.Cube = Cube;
