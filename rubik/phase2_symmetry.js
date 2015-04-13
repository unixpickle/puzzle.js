// Using symmetry in phase-2 allows us to be more adventurous with the
// heuristics we use since we are less constrained by memory and initialization
// time.

// p2EdgeSymmetryPermute applies a UD symmetry to a given permutation of 8
// elements which represent UD edge pieces on a phase-2 cube.
function p2EdgeSymmetryPermute(sym, array) {
  var lrFlip = symmetry.udSymmetryLRFlip(sym);
  
  // Apply whatever y rotation there might be.
  var yRot = symmetry.udSymmetryY(sym);
  if (yRot === 1) {
    permute4Forwards(array, 0);
    permute4Backwards(array, 4);
  } else if (yRot === 3) {
    permute4Backwards(array, 0);
    permute4Forwards(array, 4);
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
    var temp = sym[1];
    sym[1] = sym[3];
    sym[3] = temp;
    temp = sym[5];
    sym[5] = sym[7];
    sym[7] = temp;
  }
  
  // If there is a UD reflection, swap the first four elements with the last
  // four elements.
  if (symmetry.udSymmetryUDFlip(sym)) {
    for (var i = 0; i < 4; ++i) {
      var temp = sym[i];
      sym[i] = sym[i + 4];
      sym[i + 4] = temp;
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

exports.p2EdgeSymmetryPermute = p2EdgeSymmetryPermute;
exports.p2SliceSymmetryPermute = p2SliceSymmetryPermute;
