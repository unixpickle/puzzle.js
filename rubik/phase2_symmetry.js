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

// Phase2Sym is an abstract base class which implements move application and raw
// to symmetry conversion for symmetry coordinates.
// The numRaw argument is the number of raw configurations there are.
// The numSym argument is the number of configurations up to symmetry. This is
// 1/16th the number of symmetry coordinates.
function Phase2Sym(numRaw, numSym) {
  // this._moves maps every pair (C, M) to a symmetry coordinate, where C is a
  // unique edge case up to symmetry and M is a move between 0 and 10.
  this._moves = new Uint16Array(numSym * 10);
  
  // this._rawToSym maps every raw coordinate (obtained by encoding the
  // permutation of the UD edges) to a corresponding symmetry coordinate.
  this._rawToSym = new Uint16Array(numRaw);
  
  // Set every entry in the moves table to 0xffff.
  for (var i = 0, len = numSym*10; i < len; ++i) {
    this._moves[i] = 0xfffff;
  }
  
  // Set every entry in the rawToSym table to 0xffff.
  for (var i = 0; i < numRaw; ++i) {
    this._rawToSym[i] = 0xffff;
  }
}

// move applies a move to a symmetry coordinate and returns a new symmetry
// coordinate.
Phase2Sym.prototype.move = function(coord, move) {
  var s = coord & 0xf;
  var c = coord >>> 4;
  
  // Find the move s*m*s'. We do this because s'*(s*m*s')*c*s is equivalent to
  // m*s'*c*s, which is what we are really looking for.
  var moveInvConj = p2MoveSymmetryInvConj(s, move);
  var x = this._moves[c*10 + moveInvConj];
  
  var s1 = x & 0xf;
  var c1 = x >>> 4;
  
  // We now have s*m*s'*c expressed as s1'*c1*s1, but we want m*s'*c*s. This is
  // equal to s*x*s', so the result is (s'*s1')*c1*(s1*s).
  return (c1 << 4) | symmetry.udSymmetryProduct(s1, s);
};

// rawToSym converts a raw edge coordinate to a symmetry coordinate.
Phase2Sym.prototype.rawToSym = function(raw) {
  return this._rawToSym[raw];
};

// Phase2EdgeSym manages everything having to do with the phase-2 edge symmetry
// coordinate.
//
// Edge symmetry coordinates are stored as (C << 4) | S, where S is some UD
// symmetry and C is an edge case up to symmetry. Since there are 2768 edge
// cases up to symmetry, there are a total of 44,288 coordinates. This is more
// than 40,320, showing that symmetry coordinates have some redundancies. This
// is acceptable, however, because symmetry coordinates are not required to act
// as perfect hashes.
function Phase2EdgeSym(perm8) {
  Phase2Sym.call(this, 40320, 2768);
  
  this._generateRawToSym(perm8);
  this._generateMoves(perm8);
}

Phase2EdgeSym.prototype = Object.create(Phase2Sym.prototype);

// _generateRawToSym generates the _rawToSym table which maps raw cases to their
// symmetry coordinates.
Phase2EdgeSym.prototype._generateRawToSym = function(perm8) {
  var permutationCache = [];
  
  // Go through each permutation, find the lowest symmetry of it, and use it.
  var caseCount = 0;
  for (var i = 0; i < 40320; ++i) {
    // Skip this iteration if the permutation has already been accounted for by
    // a symmetrically equivalent permutation.
    if (this._rawToSym[i] !== 0xffff) {
      continue;
    }
    
    // Save the hash up to symmetry.
    var symHash = caseCount++;
    
    // Save this permutation in the table with the identity symmetry operator.
    this._rawToSym[i] = symHash << 4;
    
    // Generate all the symmetries of this permutation and hash each one.
    var perm = perm8[i];
    for (var j = 1; j < 0x10; ++j) {
      var p = p2EdgeSymmetryConj(j, perm);
      var hash = perms.encodeDestructablePerm(p);
      if (this._rawToSym[hash] === 0xffff) {
        this._rawToSym[hash] = (symHash << 4) | j;
      }
    }
  }
};

// _generateMoves applies all 10 moves to each of the unique edge cases and
// records the results.
Phase2EdgeSym.prototype._generateMoves = function(perm8) {
  for (var i = 0; i < 40320; ++i) {
    var symCoord = this._rawToSym[i];
    
    // We only want symmetry coordinates with the identity symmetry.
    if ((symCoord & 0xf) !== 0) {
      continue;
    }
    
    var perm = perm8[i];
    var symCase = symCoord >>> 4;
    for (var m = 0; m < 10; ++m) {
      if (this._moves[symCase*10 + m] !== 0xffff) {
        continue;
      }
      
      var res = moveUDEdgePerm(perm, m);
      var resSym = this._rawToSym[res];
      this._moves[symCase*10 + m] = resSym;
      
      // Avoid some extra calls to moveUDEdgePerm (which is relatively
      // expensive) by also doing the inverse of the move.
      var s = resSym & 0xf;
      var c1 = resSym >>> 4;
      // We know that m*symCase = s'*c1*s. Using some algebra, we can show that
      // (s*m'*s')*c1 = s*symCase*s'.
      var invMove = p2MoveSymmetryInvConj(s, p2MoveInverse(m));
      var invCoord = (symCase << 4) | symmetry.udSymmetryInverse(s);
      this._moves[c1*10 + invMove] = invCoord;
    }
  }
};

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

exports.Phase2EdgeSym = Phase2EdgeSym;
exports.p2EdgeSymmetryConj = p2EdgeSymmetryConj;
exports.p2EdgeSymmetryPermute = p2EdgeSymmetryPermute;
exports.p2SliceSymmetryPermute = p2SliceSymmetryPermute;
