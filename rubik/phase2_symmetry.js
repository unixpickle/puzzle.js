// Using symmetry in phase-2 allows us to be more adventurous with the
// heuristics we use since we are less constrained by memory and initialization
// time.

// Phase2EdgeSym manages everything having to do with the phase-2 edge symmetry
// coordinate. These coordinates are stored as (C << 4) | S, where S is some
// symmetry and C is an edge case up to symmetry. These coordinates are not
// necessarily unique, but that is acceptable.
function Phase2EdgeSym() {
  // this._rawToSym maps every raw coordinate (obtained by encoding the
  // permutation of the UD edges) to a corresponding symmetry coordinate.
  this._rawToSym = new Uint16Array(40320);
  
  this._generateRawToSym();
}

// rawToSym converts a raw edge coordinate to a symmetry coordinate.
Phase2EdgeSym.prototype.rawToSym = function(raw) {
  return this._rawToSym[raw];
};

// _generateRawToSym generates the _rawToSym table which maps raw cases to their
// symmetry coordinates.
Phase2EdgeSym.prototype._generateRawToSym = function() {
  // Set every element to 0xffff so we can tell when elements have been set.
  for (var i = 0; i < 40320; ++i) {
    this._rawToSym[i] = 0xffff;
  }
  
  var permutationCache = [];
  
  // Go through each permutation, find the lowest symmetry of it, and use it.
  var perm8 = perms.allPerms(8);
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
      this._rawToSym[hash] = (symHash << 4) | j;
    }
  }
};

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
