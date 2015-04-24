// Phase2ChooseCoord manages the coordinate for the UD corner "choice". This
// coordinate keeps track of which corners belong on the bottom layer or the top
// layer. As a result, there are (8 choose 4) = 70 total cases.
function Phase2ChooseCoord() {
  // this._invSymmetries stores every case conjugated by every symmetry. The
  // value this._invSymmetries[raw*16 + sym] gives sym*raw*sym'.
  this._invSymmetries = new Uint8Array(70 * 16);

  // this._moves stores every move applied to every configuration. A given move
  // can be applied to a raw state using this.moves[raw*10 + move].
  this._moves = new Uint8Array(70 * 10);

  var cases = this._cases();
  this._generateMoves(cases);
  this._generateInvSymmetries(cases);
}

// convertRawCorners converts a raw corner coordinate into a Phase2SliceCoord.
Phase2ChooseCoord.prototype.convertRawCorners = function(rawCoord) {
  // NOTE: this could be made faster with a conversion table. This may be an
  // issue if a lot of phase-1 solutions are found.
  var permutation = perms.decodePerm(rawCoord, 8);
  return cornerPermToChoose(permutation);
};

// invConjSym conjugates a coordinate with the inverse of a symmetry, returning
// sym*coord*sym'.
Phase2ChooseCoord.prototype.invConjSym = function(sym, coord) {
  return this._invSymmetries[(coord << 4) | sym];
}

// move applies a move to the choose case.
Phase2ChooseCoord.prototype.move = function(coord, move) {
  return this._moves[coord*10 + move];
};

// _cases creates a list of all 70 choices represented as arrays and returns it.
Phase2ChooseCoord.prototype._cases = function() {
  var res = [];
  for (var a = 0; a < 5; ++a) {
    for (var b = a+1; b < 6; ++b) {
      for (var c = b+1; c < 7; ++c) {
        for (var d = c+1; d < 8; ++d) {
          var theCase = [false, false, false, false, false, false, false,
            false];
          theCase[a] = true;
          theCase[b] = true;
          theCase[c] = true;
          theCase[d] = true;
          res.push(theCase);
        }
      }
    }
  }
  return res;
};

// _generateInvSymmetries generates the symmetries for every case.
Phase2ChooseCoord.prototype._generateInvSymmetries = function(cases) {
  for (var i = 0; i < 70; ++i) {
    // The identity symmetry does not change the case.
    this._invSymmetries[i << 4] = i;

    var cornerPerm = cornerPermFromChoose(cases[i]);
    for (var sym = 1; sym < 0x10; ++sym) {
      var newPerm = p2CornerSymmetryConj(symmetry.udSymmetryInverse(sym),
        cornerPerm);
      this._invSymmetries[(i << 4) | sym] = cornerPermToChoose(newPerm);
    }
  }
};

// _generateMoves generates the moves for every case.
Phase2ChooseCoord.prototype._generateMoves = function(cases) {
  for (var i = 0, len = 70*10; i < len; ++i) {
    this._moves[i] = 0xff;
  }

  for (var i = 0; i < 70; ++i) {
    var choose = cases[i];
    for (var move = 0; move < 10; ++move) {
      if (this._moves[i*10 + move] !== 0xff) {
        continue;
      }

      var appliedCase = moveYCornerChoose(choose, move);
      this._moves[i*10 + move] = appliedCase;

      // Store the inverse of the move to avoid extra moveYCornerChoose calls.
      this._moves[appliedCase*10 + p2MoveInverse(move)] = i;
    }
  }
};

// Phase2SliceCoord manages the M slice coordinate for the phase-2 solver. This
// coordinate is very small (only 24 permutations), so this object is very
// lightweight.
function Phase2SliceCoord(perm4) {
  // this._invSymmetries makes it easy and efficient to apply any of the 16
  // symmetries to a slice coordinate. The value
  // this._invSymmetries[raw*16 + sym] is equal to sym*raw*sym'.
  this._invSymmetries = new Uint8Array(24 * 16);

  // this._moves stores every move applied to every configuration. A given move
  // can be applied to a raw state using this._moves[raw*10 + move].
  this._moves = new Uint8Array(24 * 10);

  this._generateMoves(perm4);
  this._generateSymmetries(perm4);
}

// invConjSym conjugates a coordinate with the inverse of a symmetry, returning
// sym*coord*sym'.
Phase2SliceCoord.prototype.invConjSym = function(sym, coord) {
  return this._invSymmetries[(coord << 4) | sym];
};

// move applies a move to the slice.
Phase2SliceCoord.prototype.move = function(coord, move) {
  return this._moves[coord*10 + move];
};

// _generateMoves generates the move table for the slice.
Phase2SliceCoord.prototype._generateMoves = function(perm4) {
  for (var i = 0; i < 24; ++i) {
    var perm = perm4[i];
    for (var move = 0; move < 10; ++move) {
      var newState = moveESlicePerm(perm, move);
      this._moves[i*10 + move] = newState;
    }
  }
};

// _generateSymmetries generates the table for applying symmetries to a given
// coordinate.
Phase2SliceCoord.prototype._generateSymmetries = function(perm4) {
  for (var i = 0; i < 24; ++i) {
    var perm = perm4[i];
    for (var sym = 0; sym < 0x10; ++sym) {
      var p = p2SliceSymmetryConj(symmetry.udSymmetryInverse(sym), perm);
      var hash = perms.encodeDestructablePerm(p);
      this._invSymmetries[(i << 4) | sym] = hash;
    }
  }
};

// cornerPermFromChoose generates a corner permutation that represents the given
// choose array for top/bottom corners. A true in the choose array indicates a
// top-layer corner.
function cornerPermFromChoose(choose) {
  var cornerPerm = [];
  var topCorners = [2, 3, 6, 7];
  var bottomCorners = [0, 1, 4, 5];
  var topUsed = 0;
  var bottomUsed = 0;
  for (var j = 0; j < 8; ++j) {
    if (choose[j]) {
      cornerPerm[j] = topCorners[topUsed++];
    } else {
      cornerPerm[j] = bottomCorners[bottomUsed++];
    }
  }
  return cornerPerm;
}

// cornerPermToChoose turns a corner permutation into a choose array, encodes
// it, and returns the encoded choose.
function cornerPermToChoose(perm) {
  var choose = [];
  for (var i = 0; i < 8; ++i) {
    choose[i] = ((perm[i] & 2) === 2);
  }
  return perms.encodeChoose(choose);
}

// moveESlicePerm applies a move to a permutation which represents the E slice
// edges. This returns a perfect hash of the result and does not modify the
// original permutation.
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

// moveYCornerChoose applies a phase-2 move to a given corner choice. It then
// then hashes the result and returns said hash. The original permutation is not
// modified.
function moveYCornerChoose(choose, move) {
  // NOTE: this code was generated by translating Go code to JavaScript.
  // This does permutations which are equivalent to moveYCornerPerm. By making
  // this an entirely different function, we are helping the JS engine by
  // avoiding polymorphic functions (because this takes an array of booleans
  // while moveYCornerPerm takes an array of numbers).
  var p = choose.slice();
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
  return perms.encodeChoose(p);
}

// p2SliceSymmetryConj conjugates a phase-2 slice permutation case with a UD
// symmetry. The result, sym'*array*sym, is returned.
function p2SliceSymmetryConj(sym, array) {
  // Apply sym to the identity permutation.
  var result = [0, 1, 2, 3];
  p2SliceSymmetryPermute(sym, result);

  // Apply array to get array*sym.
  perms.applyPerm(result, array);

  // Apply sym' to get sym'*array*sym.
  p2SliceSymmetryPermute(symmetry.udSymmetryInverse(sym), result);

  return result;
}

// p2SliceSymmetryPermute applies a UD symmetry to a given permutation of 4
// elements which represent slice edge pieces on a phase-2 cube.
function p2SliceSymmetryPermute(sym, array) {
  var lrFlip = symmetry.udSymmetryLRFlip(sym);

  // NOTE: the edges in the E slice are ordered: FR, FL, BR, BL. This is not a
  // direct ring around the cube, so we have to do permutations manually.

  // Apply whatever y rotation we need to. Unfortunately, we can't use the nice
  // permute4...() functions because the slice array isn't ordered in a ring.
  var yRot = symmetry.udSymmetryY(sym);
  if (yRot === 1) {
    var temp = array[2];
    array[2] = array[3];
    array[3] = array[1];
    array[1] = array[0];
    array[0] = temp;
  } else if (yRot === 3) {
    var temp = array[0];
    array[0] = array[1];
    array[1] = array[3];
    array[3] = array[2];
    array[2] = temp;
  } else if (yRot === 2) {
    // y^2 is LRflip*FBflip.
    lrFlip = !lrFlip;

    // Perform an FBflip.
    var temp = array[0];
    array[0] = array[2];
    array[2] = temp;
    temp = array[1];
    array[1] = array[3];
    array[3] = temp;
  }

  if (lrFlip) {
    var temp = array[0];
    array[0] = array[1];
    array[1] = temp;
    temp = array[2];
    array[2] = array[3];
    array[3] = temp;
  }

  // NOTE: a UD flip has no effect on the E slice.
}

exports.Phase2ChooseCoord = Phase2ChooseCoord;
exports.Phase2SliceCoord = Phase2SliceCoord;
exports.p2SliceSymmetryConj = p2SliceSymmetryPermute;
exports.p2SliceSymmetryPermute = p2SliceSymmetryPermute;
