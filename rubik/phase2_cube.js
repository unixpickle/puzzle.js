// Phase2Coords manages all the coordinates needed for the phase-2 solver.
function Phase2Coords() {
  var perm8 = perms.allPerms(8);
  this.choose = new Phase2ChooseCoord();
  this.corners = new Phase2CornerCoord(perm8);
  this.edges = new Phase2EdgeCoord(perm8);
  this.slice = new Phase2SliceCoord(perms.allPerms(4));
}

// A Phase2Cube represents the state of a cube that is important to the phase-2
// solver.
function Phase2Cube() {
  // The solved choose coordinate represents 00110011
  this.chooseCoord = 60;
  this.cornerCoord = 0;
  this.edgeCoord = 0;
  this.sliceCoord = 0;
}

// move applies a phase-2 move (a number in the range [0, 10)) to the cube given
// a pre-computed Phase2Coords table.
Phase2Cube.prototype.move = function(m, coords) {
  this.chooseCoord = coords.choose.move(this.chooseCoord, m);
  this.cornerCoord = coords.corners.move(this.cornerCoord, m);
  this.edgeCoord = coords.edges.move(this.edgeCoord, m);
  this.sliceCoord = coords.slice.move(this.sliceCoord, m);
};

// set updates this cube's coordinates to match the given cube.
Phase2Cube.prototype.set = function(c) {
  this.chooseCoord = c.chooseCoord;
  this.cornerCoord = c.cornerCoord;
  this.edgeCoord = c.edgeCoord;
  this.sliceCoord = c.sliceCoord;
};

// solved returns true if the Phase2Cube is solved.
Phase2Cube.prototype.solved = function() {
  return (this.cornerCoord >>> 4) === 0 && (this.edgeCoord >>> 4) === 0 &&
    this.sliceCoord === 0;
};

// convertCubieToPhase2 converts a Cube to a Phase2Cube on a given axis. This
// requires a Phase2Coords table to work.
function convertCubieToPhase2(cube, axis, coords) {
  var res = new Phase2Cube();
  var cornerPerm = 0;
  var edgePerm = 0;
  if (axis === 0) {
    cornerPerm = encodeXCornerPerm(cube.corners);
    edgePerm = encodeRLEdges(cube.edges);
    res.sliceCoord = encodeMSlicePerm(cube.edges);
  } else if (axis === 1) {
    cornerPerm = encodeYCornerPerm(cube.corners);
    edgePerm = encodeUDEdges(cube.edges);
    res.sliceCoord = encodeESlicePerm(cube.edges);
  } else if (axis === 2) {
    cornerPerm = encodeZCornerPerm(cube.corners);
    edgePerm = encodeFBEdges(cube.edges);
    res.sliceCoord = encodeSSlicePerm(cube.edges);
  }
  res.chooseCoord = coords.choose.convertRawCorners(cornerPerm);
  res.cornerCoord = coords.corners.rawToSym(cornerPerm);
  res.edgeCoord = coords.edges.rawToSym(edgePerm);
  return res;
}

function encodeESlicePerm(e) {
  var perm = [];
  for (var i = 0; i < 4; ++i) {
    var slot = [1, 3, 7, 9][i];
    var piece = e.edges[slot].piece;
    perm[i] = [-1, 0, -1, 1, -1, -1, -1, 2, -1, 3, -1, -1][piece];
    if (perm[i] < 0) {
      throw new Error('invalid piece in slice: ' + piece);
    }
  }
  return perms.encodeDestructablePerm(perm);
}

function encodeFBEdges(e) {
  var perm = [];
  for (var i = 0; i < 8; ++i) {
    var slot = [0, 1, 2, 3, 6, 7, 8, 9][i];
    var piece = e.edges[slot].piece;
    perm[i] = [0, 1, 2, 3, -1, -1, 4, 5, 6, 7, -1, -1][piece];
    if (perm[i] < 0) {
      throw new Error('unexpected edge piece: ' + piece);
    }
  }
  return perms.encodeDestructablePerm(perm);
}

function encodeMSlicePerm(e) {
  var perm = [];
  for (var i = 0; i < 4; ++i) {
    var slot = [0, 2, 6, 8][i];
    var piece = e.edges[slot].piece;
    perm[i] = [0, -1, 1, -1, -1, -1, 2, -1, 3, -1, -1, -1][piece];
    if (perm[i] < 0) {
      throw new Error('invalid piece in slice: ' + piece);
    }
  }
  return perms.encodeDestructablePerm(perm);
}

function encodeRLEdges(e) {
  var perm = [];
  for (var i = 0; i < 8; ++i) {
    var slot = [9, 4, 3, 10, 7, 5, 1, 11][i];
    var piece = e.edges[slot].piece;
    perm[i] = [-1, 6, -1, 2, 1, 5, -1, 4, -1, 0, 3, 7][piece];
    if (perm[i] < 0) {
      throw new Error('unexpected edge piece: ' + piece);
    }
  }
  return perms.encodeDestructablePerm(perm);
}

function encodeSSlicePerm(e) {
  var perm = [];
  for (var i = 0; i < 4; ++i) {
    var slot = [11, 10, 5, 4][i];
    var piece = e.edges[slot].piece;
    perm[i] = [-1, -1, -1, -1, 3, 2, -1, -1, -1, -1, 1, 0][piece];
    if (perm[i] < 0) {
      throw new Error('invalid piece in slice: ' + piece);
    }
  }
  return perms.encodeDestructablePerm(perm);
}

function encodeUDEdges(e) {
  var perm = [];
  for (var i = 0; i < 8; ++i) {
    var slot = [6, 5, 0, 4, 8, 11, 2, 10][i];
    var piece = e.edges[slot].piece;
    perm[i] = [2, -1, 6, -1, 3, 1, 0, -1, 4, -1, 7, 5][piece];
    if (perm[i] < 0) {
      throw new Error('unexpected edge piece: ' + piece);
    }
  }
  return perms.encodeDestructablePerm(perm);
}

function encodeXCornerPerm(c) {
  var perm = [];
  for (var i = 0; i < 8; ++i) {
    // xCornerIndices is declared in phase1_cube.js.
    var idx = xCornerIndices[i];
    perm[i] = [2, 0, 3, 1, 6, 4, 7, 5][c.corners[idx].piece];
  }
  return perms.encodeDestructablePerm(perm);
}

function encodeYCornerPerm(c) {
  var perm = [];
  for (var i = 0; i < 8; ++i) {
    perm[i] = c.corners[i].piece;
  }
  return perms.encodeDestructablePerm(perm);
}

function encodeZCornerPerm(c) {
  var perm = [];
  for (var i = 0; i < 8; ++i) {
    // zCornerIndices is declared in phase1_cube.js.
    var idx = zCornerIndices[i];
    perm[i] = [4, 5, 0, 1, 6, 7, 2, 3][c.corners[idx].piece];
  }
  return perms.encodeDestructablePerm(perm);
}

// p2MoveFace returns the face of a phase-2 move.
function p2MoveFace(m) {
  return [2, 3, 4, 5, 0, 0, 0, 1, 1, 1][m] + 1;
}

// p2MoveInverse finds the inverse of a phase-2 move.
function p2MoveInverse(m) {
  return [0, 1, 2, 3, 5, 4, 6, 8, 7, 9][m];
}

// p2MoveMove returns the Move for a phase-2 move.
// Along the Y axis (axis 1), the phase-2 moves are F2 B2 R2 L2 U U' U2 D D' D2
// in that order.
function p2MoveMove(m, axis) {
  var num = [
    [14, 15, 12, 13, 5, 11, 17, 4, 10, 16],
		[14, 15, 16, 17, 0, 6, 12, 1, 7, 13],
		[13, 12, 16, 17, 2, 8, 14, 3, 9, 15]
  ][axis][m];
  return new Move(num);
}

exports.Phase2Coords = Phase2Coords;
exports.Phase2Cube = Phase2Cube;
exports.convertCubieToPhase2 = convertCubieToPhase2;
exports.p2MoveFace = p2MoveFace;
exports.p2MoveInverse = p2MoveInverse;
exports.p2MoveMove = p2MoveMove;
