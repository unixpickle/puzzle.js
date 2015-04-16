// moveSymInvConjugates[m][s] gives s*m*s'.
var moveSymInvConjugates = [
  [0, 3, 1, 2, 0, 2, 1, 3, 0, 3, 1, 2, 0, 2, 1, 3],
  [1, 2, 0, 3, 1, 3, 0, 2, 1, 2, 0, 3, 1, 3, 0, 2],
  [2, 0, 3, 1, 3, 0, 2, 1, 2, 0, 3, 1, 3, 0, 2, 1],
  [3, 1, 2, 0, 2, 1, 3, 0, 3, 1, 2, 0, 2, 1, 3, 0],
  [4, 4, 4, 4, 5, 5, 5, 5, 8, 8, 8, 8, 7, 7, 7, 7],
  [5, 5, 5, 5, 4, 4, 4, 4, 7, 7, 7, 7, 8, 8, 8, 8],
  [6, 6, 6, 6, 6, 6, 6, 6, 9, 9, 9, 9, 9, 9, 9, 9],
  [7, 7, 7, 7, 8, 8, 8, 8, 5, 5, 5, 5, 4, 4, 4, 4],
  [8, 8, 8, 8, 7, 7, 7, 7, 4, 4, 4, 4, 5, 5, 5, 5],
  [9, 9, 9, 9, 9, 9, 9, 9, 6, 6, 6, 6, 6, 6, 6, 6]
];

// Phase2SymCoord is an abstract base class which helps implement phase-2
// symmetry coordinates.
//
// The numRaw argument is the number of raw coordinates.
// The numSym argument is the number of coordinates which are unique up to
// symmetry.
//
// Symmetry coordinates are pairs (C, S) where C is a unique case up to
// symmetry and S is a UD symmetry operation. The pair (C, S) represents the
// state S'*C*S. These coordinates are encoded into integers as (C << 4) | S.
function Phase2SymCoord(numRaw, numSym) {
  // There are 12 bits for the equivalence class and 4 bits for the symmetry.
  if (numSym >= 0x1000) {
    throw new Error('Phase2SymCoord cannot represent more than 4096 ' +
      'equivalence classes');
  }
  
  this.numRaw = numRaw;
  this.numSym = numSym;
  
  // TODO: document this.
  this._moves = new Uint16Array(numSym * 160);
  
  // this._rawToSym maps every raw coordinate to a corresponding symmetry
  // coordinate.
  this._rawToSym = new Uint16Array(numRaw);
  
  // Set every entry in the moves table to 0xffff.
  for (var i = 0, len = numSym*160; i < len; ++i) {
    this._moves[i] = 0xffff;
  }
  
  // Set every entry in the rawToSym table to 0xffff.
  for (var i = 0; i < numRaw; ++i) {
    this._rawToSym[i] = 0xffff;
  }
}

// move applies a move to a symmetry coordinate and returns a new symmetry
// coordinate.
Phase2SymCoord.prototype.move = function(coord, move) {
  return this._moves[coord*10 + move];
};

// rawToSym converts a raw edge coordinate to a symmetry coordinate.
Phase2SymCoord.prototype.rawToSym = function(raw) {
  return this._rawToSym[raw];
};

// _generateMoves fills in the move table for the symmetry coordinate.
// The rawPerms argument contains the permutations corresponding to the raw
// coordinate.
// The moveFunc argument is a function which takes a permutation and a phase-2
// move and returns an encoded raw coordinate corresponding to the coordinate
// after applying the given move.
Phase2SymCoord.prototype._generateMoves = function(rawPerms, moveFunc) {
  // Generate moves for all symmetry coordinates.
  for (var i = 0, len = rawPerms.length; i < len; ++i) {
    var symCoord = this._rawToSym[i];
    
    // We only want symmetry coordinates with the identity symmetry.
    if ((symCoord & 0xf) !== 0) {
      continue;
    }
    
    var perm = rawPerms[i];
    var symCase = symCoord >>> 4;
    for (var move = 0; move < 10; ++move) {
      if (this._moves[symCase*160 + move] !== 0xffff) {
        continue;
      }
      
      var res = moveFunc(perm, move);
      var resSym = this._rawToSym[res];
      this._moves[symCase*160 + move] = resSym;
      
      // Avoid some extra calls to moveFunc (which may be relatively expensive)
      // by also doing the inverse of the move.
      
      var s = resSym & 0xf;
      var c1 = resSym >>> 4;
      
      // We know that m*symCase = s'*c1*s. Using some algebra, we can show that
      // (s*m'*s')*c1 = s*symCase*s'.
      
      var invMove = p2MoveSymmetryInvConj(s, p2MoveInverse(move));
      var invCoord = (symCase << 4) | symmetry.udSymmetryInverse(s);
      this._moves[c1*160 + invMove] = invCoord;
    }
  }
  
  // Generate moves for the rest of the coordinates.
  for (var c = 0, numSym = this.numSym; c < numSym; ++c) {
    for (var sym = 1; sym < 0x10; ++sym) {
      for (var move = 0; move < 10; ++move) {
        // Find the move s*m*s'. We do this because s'*(s*m*s')*c*s is
        // equivalent to m*s'*c*s, which is what we are really looking for.
        var moveInvConj = p2MoveSymmetryInvConj(sym, move);
        var x = this._moves[c*160 + moveInvConj];
  
        var s1 = x & 0xf;
        var c1 = x >>> 4;
  
        // We now have s*m*s'*c expressed as s1'*c1*s1, but we want m*s'*c*s.
        // This is equal to s*x*s', so the result is (s'*s1')*c1*(s1*s).
        this._moves[((c << 4) | sym)*10 + move] =
          (c1 << 4) | symmetry.udSymmetryProduct(s1, sym);
      }
    }
  }
};

// _generateRawToSym generates the _rawToSym table which maps raw cases to their
// symmetry coordinates.
// The rawPerms argument contains the permutations corresponding to the raw
// coordinate.
// The symConjFunc argument is a function which takes a symmetry and a
// permutation and returns a new permutation which was conjugated by the
// symmetry.
Phase2SymCoord.prototype._generateRawToSym = function(rawPerms, symConjFunc) {
  // caseCount is incremented every time a new equivalence class is found.
  var caseCount = 0;
  
  // Find the first permutation for each symmetry equivalence class.
  for (var i = 0, len = rawPerms.length; i < len; ++i) {
    // Skip this iteration if the permutation has already been accounted for by
    // a symmetrically equivalent permutation.
    if (this._rawToSym[i] !== 0xffff) {
      continue;
    }
    
    // Get the index of the unique case up to symmetry.
    var symHash = caseCount++;
    
    // Save this permutation in the table with the identity symmetry operator.
    this._rawToSym[i] = symHash << 4;
    
    // Generate all the symmetries of this permutation and hash each one.
    var perm = rawPerms[i];
    for (var sym = 1; sym < 0x10; ++sym) {
      var p = symConjFunc(sym, perm);
      var hash = perms.encodeDestructablePerm(p);
      if (this._rawToSym[hash] === 0xffff) {
        this._rawToSym[hash] = (symHash << 4) | sym;
      }
    }
  }
}

// Phase2CornerCoord manages everything having to do with the phase-2 corner
// symmetry coordinate.
function Phase2CornerCoord(perm8) {
  Phase2SymCoord.call(this, 40320, 2768);
  
  this._generateRawToSym(perm8, p2CornerSymmetryConj);
  this._generateMoves(perm8, moveYCornerPerm);
}

Phase2CornerCoord.prototype = Object.create(Phase2SymCoord.prototype);

// Phase2EdgeCoord manages everything having to do with the phase-2 edge
// symmetry coordinate.
function Phase2EdgeCoord(perm8) {
  Phase2SymCoord.call(this, 40320, 2768);
  
  this._generateRawToSym(perm8, p2EdgeSymmetryConj);
  this._generateMoves(perm8, moveUDEdgePerm);
}

Phase2EdgeCoord.prototype = Object.create(Phase2SymCoord.prototype);

// moveUDPerm applies a phase-2 move to a given edge permutation case. It then
// hashes the result and returns said hash. The original permutation is not
// modified.
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

// moveYCornerPerm applies a phase-2 move to a given corner permutation case. It
// then hashes the result and returns said hash. The original permutation is not
// modified.
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

// p2CornerSymmetryConj conjugates a phase-2 corner permutation case with a UD
// symmetry. The result, sym'*array*sym, is returned.
function p2CornerSymmetryConj(sym, array) {
  // Apply sym to the identity permutation.
  var result = [0, 1, 2, 3, 4, 5, 6, 7];
  p2CornerSymmetryPermute(sym, result);
  
  // Apply array to get array*sym.
  perms.applyPerm(result, array);
  
  // Apply sym' to get sym'*array*sym.
  p2CornerSymmetryPermute(symmetry.udSymmetryInverse(sym), result);
  
  return result;
}

// p2CornerSymmetryPermute applies a UD symmetry to a given permutation of 8
// elements which represent the corner pieces on a phase-2 cube.
function p2CornerSymmetryPermute(sym, array) {
  var lrFlip = symmetry.udSymmetryLRFlip(sym);
  
  // Apply whatever y rotation there might be.
  var yRot = symmetry.udSymmetryY(sym);
  if (yRot === 1) {
    // Permute the top and bottom corners. We cannot use permute4Forwards :(.
    var temp = array[2];
    array[2] = array[6];
    array[6] = array[7];
    array[7] = array[3];
    array[3] = temp;
    temp = array[0];
    array[0] = array[4];
    array[4] = array[5];
    array[5] = array[1];
    array[1] = temp;
  } else if (yRot === 3) {
    // Permute the top and bottom corners. We cannot use permute4Backwards :(.
    var temp = array[2];
    array[2] = array[3];
    array[3] = array[7];
    array[7] = array[6];
    array[6] = temp;
    temp = array[0];
    array[0] = array[1];
    array[1] = array[5];
    array[5] = array[4];
    array[4] = temp;
  } else if (yRot === 2) {
    // y2 is equivalent to LRflip*FBflip, so I will do an FBflip and switch
    // lrFlip.
    lrFlip = !lrFlip;
    
    // Swap the first four corners with the last four corners (0YX + 4 = 1YX).
    for (var i = 0; i < 4; ++i) {
      var temp = array[i];
      array[i] = array[i | 4];
      array[i | 4] = temp;
    }
  }
  
  if (lrFlip) {
    // Swap even corners with odd corners, since ZY0 + 1 = ZY1.
    for (var i = 0; i < 8; i += 2) {
      var temp = array[i];
      array[i] = array[i | 1];
      array[i | 1] = temp;
    }
  }
  
  if (symmetry.udSymmetryUDFlip(sym)) {
    // Swap corners with coordinates Z0X with those with coordinates Z1X.
    for (var i = 0; i < 4; ++i) {
      // Right now, I is the number ZX. We want Z0X, so we shift up the second
      // bit.
      var bottomIdx = (i & 1) | ((i & 2) << 1);
      
      // ORing the bottom index with 2 turns X0Z into X1Z.
      var topIdx = bottomIdx | 2;
      
      // Do the swap itself.
      var temp = array[bottomIdx];
      array[bottomIdx] = array[topIdx];
      array[topIdx] = temp;
    }
  }
}

// p2EdgeSymmetryConj conjugates a phase-2 edge permutation case with a UD
// symmetry. The result, sym'*array*sym, is returned.
function p2EdgeSymmetryConj(sym, array) {
  // Apply sym to the identity permutation.
  var result = [0, 1, 2, 3, 4, 5, 6, 7];
  p2EdgeSymmetryPermute(sym, result);
  
  // Apply array to get array*sym.
  perms.applyPerm(result, array);
  
  // Apply sym' to get sym'*array*sym.
  p2EdgeSymmetryPermute(symmetry.udSymmetryInverse(sym), result);
  
  return result;
}

// p2EdgeSymmetryPermute applies a UD symmetry to a given permutation of 8
// elements which represent UD edge pieces on a phase-2 cube.
function p2EdgeSymmetryPermute(sym, array) {
  var lrFlip = symmetry.udSymmetryLRFlip(sym);
  
  // Apply whatever y rotation there might be.
  var yRot = symmetry.udSymmetryY(sym);
  if (yRot === 1) {
    permute4Forwards(array, 0);
    permute4Forwards(array, 4);
  } else if (yRot === 3) {
    permute4Backwards(array, 0);
    permute4Backwards(array, 4);
  } else if (yRot === 2) {
    // Doing y^2 is equivalent to doing LRflip*FBflip.
    lrFlip = !lrFlip;
    
    // Do an FBflip.
    var temp = array[0];
    array[0] = array[2];
    array[2] = temp;
    temp = array[4];
    array[4] = array[6];
    array[6] = temp;
  }
  
  // If there is an LR reflection, swap [1] with [3] and [5] with [7].
  if (lrFlip) {
    var temp = array[1];
    array[1] = array[3];
    array[3] = temp;
    temp = array[5];
    array[5] = array[7];
    array[7] = temp;
  }
  
  // If there is a UD reflection, swap the first four elements with the last
  // four elements.
  if (symmetry.udSymmetryUDFlip(sym)) {
    for (var i = 0; i < 4; ++i) {
      var temp = array[i];
      array[i] = array[i + 4];
      array[i + 4] = temp;
    }
  }
}

// p2MoveSymmetryInvConj conjugates a move m with a symmetry s' to find s*m*s'.
function p2MoveSymmetryInvConj(s, m) {
  return moveSymInvConjugates[m][s];
}

function permute4Forwards(array, start) {
  // Ignoring start, this does the following:
  // a[0], a[1], a[2], a[3] = a[3], a[0], a[1], a[2].
  var temp = array[start + 3];
  array[start + 3] = array[start + 2];
  array[start + 2] = array[start + 1];
  array[start + 1] = array[start];
  array[start] = temp;
}

function permute4Backwards(array, start) {
  // Ignoring start, this does the following:
  // a[0], a[1], a[2], a[3] = a[1], a[2], a[3], a[0]
  var temp = array[start];
  array[start] = array[start + 1];
  array[start + 1] = array[start + 2];
  array[start + 2] = array[start + 3];
  array[start + 3] = temp;
}

exports.Phase2CornerCoord = Phase2CornerCoord;
exports.Phase2EdgeCoord = Phase2EdgeCoord;
exports.p2CornerSymmetryConj = p2CornerSymmetryConj;
exports.p2CornerSymmetryPermute = p2CornerSymmetryPermute;
exports.p2EdgeSymmetryConj = p2EdgeSymmetryConj;
exports.p2EdgeSymmetryPermute = p2EdgeSymmetryPermute;
