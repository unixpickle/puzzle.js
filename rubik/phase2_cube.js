// p2LRMoveMirrors associates each phase-2 move with it's mirror on the LR axis.
var p2LRMoveMirrors = [0, 1, 3, 2, 5, 4, 6, 8, 7, 9];

// A Phase2Cube represents the state of a cube that is important to the phase-2
// solver.
function Phase2Cube() {
  this.cornerPerm = 0;
  this.edgePerm = 0;
  this.slicePerm = 0;
}

// move applies a phase-2 move (a number in the range [0, 10)) to the cube given
// a pre-computed Phase2Moves table.
Phase2Cube.prototype.move = function(m, moves) {
  this.cornerPerm = moves.cornerMoves[this.cornerPerm*10 + m];
  this.edgePerm = moves.edgeMoves[this.edgePerm*10 + m];
  this.slicePerm = moves.sliceMoves[this.slicePerm*10 + m];
};

// set updates this cube's coordinates to match the given cube.
Phase2Cube.prototype.set = function(c) {
  this.cornerPerm = c.cornerPerm;
  this.edgePerm = c.edgePerm;
  this.slicePerm = c.slicePerm;
};

// solved returns true if the Phase2Cube is solved.
Phase2Cube.prototype.solved = function() {
  return this.cornerPerm === 0 && this.edgePerm === 0 && this.slicePerm === 0;
};

// Phase2Moves stores a set of tables which can be used to apply moves to a
// phase-2 state.
function Phase2Moves() {
  this.cornerMoves = new Uint16Array(403200);
  this.edgeMoves = new Uint16Array(403200);
  this.sliceMoves = new Uint16Array(240);
  
  var perm8 = perms.allPerms(8);
  this._generateCornerMoves(perm8);
  this._generateEdgeMoves(perm8);
  this._generateSliceMoves();
}

Phase2Moves.prototype._generateCornerMoves = function(perm8) {
  for (var i = 0; i < 403200; ++i) {
    this.cornerMoves[i] = 0xffff;
  }
  
  var lrMirrors = generateLRCornerMirrors(perm8);
  
  // Apply every move to every corner state.
  for (var state = 0; state < 40320; ++state) {
    var perm = perm8[state];
    
    // Loop through all 10 moves and apply them.
    for (var m = 0; m < 10; ++m) {
      if (this.cornerMoves[state*10 + m] !== 0xffff) {
        continue;
      }
      
      // Record the end state of this move.
      var endState = moveYCornerPerm(perm, m);
      this.cornerMoves[state*10 + m] = endState;
      
      // Set the inverse of this state.
      this.cornerMoves[endState*10 + p2MoveInverse(m)] = state;
      
      // Set the LR mirror of this state.
      var lrState = lrMirrors[state];
      var lrEndState = lrMirrors[endState];
      var moveMirror = p2LRMoveMirrors[m];
      this.cornerMoves[lrState*10 + moveMirror] = lrEndState;
      
      // Set the inverse of the LR mirror.
      this.cornerMoves[lrEndState*10 + p2MoveInverse(moveMirror)] = lrState;
    }
  }
};

Phase2Moves.prototype._generateEdgeMoves = function(perm8) {
  for (var i = 0; i < 403200; ++i) {
    this.edgeMoves[i] = 0xffff;
  }
  
  var lrMirrors = generateLREdgeMirrors(perm8);
  
  // Apply every move to every edge state.
  for (var state = 0; state < 40320; ++state) {
    var perm = perm8[state];
    
    // Apply all 10 moves to the cube.
    for (var m = 0; m < 10; ++m) {
      if (this.edgeMoves[state*10 + m] !== 0xffff) {
        continue;
      }
      
      var endState = moveUDEdgePerm(perm, m);
      this.edgeMoves[state*10 + m] = endState;
      
      // Set the inverse of this state.
      this.edgeMoves[endState*10 + p2MoveInverse(m)] = state;
      
      // Set the LR mirror of this state.
      var lrState = lrMirrors[state];
      var lrEndState = lrMirrors[endState];
      var moveMirror = p2LRMoveMirrors[m];
      this.edgeMoves[lrState*10 + moveMirror] = lrEndState;
      
      // Set the inverse of the LR mirror.
      this.edgeMoves[lrEndState*10 + p2MoveInverse(moveMirror)] = lrState;
    }
  }
};

Phase2Moves.prototype._generateSliceMoves = function() {
  // NOTE: I don't bother with any optimizations here because it's only 24 cases
  // as opposed to 40320 for the other types of state.
  var perm4 = perms.allPerms(4);
  for (var i = 0; i < 24; ++i) {
    var perm = perm4[i];
    
    // Apply all 10 moves to the state.
    for (var m = 0; m < 10; ++m) {
      var endState = moveESlicePerm(perm, m);
      this.sliceMoves[i*10 + m] = endState;
    }
  }
};

// convertCubieToPhase2 converts a Cube to a Phase2Cube on a given axis.
function convertCubieToPhase2(cube, axis) {
  var res = new Phase2Cube();
  if (axis === 0) {
    res.cornerPerm = encodeXCornerPerm(cube.corners);
    res.edgePerm = encodeRLEdges(cube.edges);
    res.slicePerm = encodeMSlicePerm(cube.edges);
  } else if (axis === 1) {
    res.cornerPerm = encodeYCornerPerm(cube.corners);
    res.edgePerm = encodeUDEdges(cube.edges);
    res.slicePerm = encodeESlicePerm(cube.edges);
  } else if (axis === 2) {
    res.cornerPerm = encodeZCornerPerm(cube.corners);
    res.edgePerm = encodeFBEdges(cube.edges);
    res.slicePerm = encodeSSlicePerm(cube.edges);
  }
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

// generateLRCornerMirrors generates and returns an array which maps every
// corner permutation to its left-right mirror.
function generateLRCornerMirrors(perm8) {
  var lrPerms = new Uint16Array(40320);
  for (var i = 0; i < 40320; ++i) {
    lrPerms[i] = 0xffff;
  }
  
  for (var i = 0; i < 40320; ++i) {
    if (lrPerms[i] !== 0xffff) {
      continue;
    }
    
    // Let F be the LR flip operation. We must find F*perm8[i]*F.
    var mirrored = [1, 0, 3, 2, 5, 4, 7, 6];
    perms.applyPerm(mirrored, perm8[i]);
    // NOTE: the LR mirror on corners happened to be really simple: just swap
    // every even corner with the corner after it.
    for (var j = 0; j < 8; j += 2) {
      var temp = mirrored[j];
      mirrored[j] = mirrored[j + 1];
      mirrored[j + 1] = temp;
    }
    
    // Set both things in the array.
    var mirror = perms.encodeDestructablePerm(mirrored)
    lrPerms[i] = mirror;
    lrPerms[mirror] = i;
  }
  
  return lrPerms;
}

// generateLREdgeMirrors generates and returns an array which maps every edge
// permutation to its left-right mirror.
function generateLREdgeMirrors(perm8) {
  var lrPerms = new Uint16Array(40320);
  for (var i = 0; i < 40320; ++i) {
    lrPerms[i] = 0xffff;
  }
  
  for (var i = 0; i < 40320; ++i) {
    if (lrPerms[i] !== 0xffff) {
      continue;
    }
    
    // Let F be the LR flip operation. We must find F*perm8[i]*F.
    var mirrored = [0, 3, 2, 1, 4, 7, 6, 5];
    perms.applyPerm(mirrored, perm8[i]);
    var temp = mirrored[1];
    mirrored[1] = mirrored[3];
    mirrored[3] = temp;
    temp = mirrored[5];
    mirrored[5] = mirrored[7];
    mirrored[7] = temp;
    
    // Set both things in the array.
    var mirror = perms.encodeDestructablePerm(mirrored);
    lrPerms[i] = mirror;
    lrPerms[mirror] = i;
  }
  
  return lrPerms;
}

function moveESlicePerm(perm, move) {
  var p = perm.slice();
  var temp;
  switch (move) {
  case 0:
    temp = p[0];
    p[0] = p[1];
    p[1] = temp;
    break;
  case 1:
    temp = p[2];
    p[2] = p[3];
    p[3] = temp;
    break;
  case 2:
    temp = p[0];
    p[0] = p[2];
    p[2] = temp;
    break;
  case 3:
    temp = p[1];
    p[1] = p[3];
    p[3] = temp;
  default:
    break;
  }
  return perms.encodeDestructablePerm(p);
}

function moveUDEdgePerm(perm, move) {
  // NOTE: this code was generated by translating Go code to JavaScript.
  var p = perm.slice();
  var temp;
  switch (move) {
  case 0:
    temp = p[2];
    p[2] = p[6];
    p[6] = temp;
    break;
  case 1:
    temp = p[0];
    p[0] = p[4];
    p[4] = temp;
    break;
  case 2:
    temp = p[1];
    p[1] = p[5];
    p[5] = temp;
    break;
  case 3:
    temp = p[3];
    p[3] = p[7];
    p[7] = temp;
    break;
  case 4:
    temp = p[3];
    p[3] = p[2];
    p[2] = p[1];
    p[1] = p[0];
    p[0] = temp;
    break;
  case 5:
    temp = p[3];
    p[3] = p[0];
    p[0] = p[1];
    p[1] = p[2];
    p[2] = temp;
    break;
  case 6:
    temp = p[0];
    p[0] = p[2];
    p[2] = temp;
    temp = p[1];
    p[1] = p[3];
    p[3] = temp;
    break;
  case 7:
    temp = p[7];
    p[7] = p[4];
    p[4] = p[5];
    p[5] = p[6];
    p[6] = temp;
    break;
  case 8:
    temp = p[7];
    p[7] = p[6];
    p[6] = p[5];
    p[5] = p[4];
    p[4] = temp;
    break;
  case 9:
    temp = p[4];
    p[4] = p[6];
    p[6] = temp;
    temp = p[5];
    p[5] = p[7];
    p[7] = temp;
    break;
  default:
    break;
  }
  return perms.encodeDestructablePerm(p);
}

function moveYCornerPerm(perm, move) {
  // NOTE: this code was generated by translating Go code to JavaScript.
  var p = perm.slice();
  var temp;
  switch (move) {
  case 0:
    temp = p[5];
    p[5] = p[6];
    p[6] = temp;
    temp = p[4];
    p[4] = p[7];
    p[7] = temp;
    break;
  case 1:
    temp = p[1];
    p[1] = p[2];
    p[2] = temp;
    temp = p[0];
    p[0] = p[3];
    p[3] = temp;
    break;
  case 2:
    temp = p[1];
    p[1] = p[7];
    p[7] = temp;
    temp = p[3];
    p[3] = p[5];
    p[5] = temp;
    break;
  case 3:
    temp = p[0];
    p[0] = p[6];
    p[6] = temp;
    temp = p[2];
    p[2] = p[4];
    p[4] = temp;
    break;
  case 4:
    temp = p[6];
    p[6] = p[7];
    p[7] = p[3];
    p[3] = p[2];
    p[2] = temp;
    break;
  case 5:
    temp = p[6];
    p[6] = p[2];
    p[2] = p[3];
    p[3] = p[7];
    p[7] = temp;
    break;
  case 6:
    temp = p[2];
    p[2] = p[7];
    p[7] = temp;
    temp = p[3];
    p[3] = p[6];
    p[6] = temp;
    break;
  case 7:
    temp = p[0];
    p[0] = p[1];
    p[1] = p[5];
    p[5] = p[4];
    p[4] = temp;
    break;
  case 8:
    temp = p[0];
    p[0] = p[4];
    p[4] = p[5];
    p[5] = p[1];
    p[1] = temp;
    break;
  case 9:
    temp = p[0];
    p[0] = p[5];
    p[5] = temp;
    temp = p[1];
    p[1] = p[4];
    p[4] = temp;
    break;
  default:
    break;
  }
  return perms.encodeDestructablePerm(p);
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

exports.Phase2Cube = Phase2Cube;
exports.Phase2Moves = Phase2Moves;
exports.convertCubieToPhase2 = convertCubieToPhase2;
exports.p2MoveFace = p2MoveFace;
exports.p2MoveInverse = p2MoveInverse;
exports.p2MoveMove = p2MoveMove;
