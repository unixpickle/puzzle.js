// xCornerIndices are the indexes of the corners on the Y axis cube which
// correspond to the corners on the X axis cube. An index in this array
// corresponds to the physical slot in the X axis cube. A value in this array
// corresponds to the physical slot in the Y axis cube.
var xCornerIndices = [1, 3, 0, 2, 5, 7, 4, 6]

// xEdgeIndices are the indexes of the edges on the Y axis cube which correspond
// to edges on the X axis cube. An index in this array corresponds to the
// physical slot in the X axis cube. A value in this array corresponds to the
// physical slot in the Y axis cube.
var xEdgeIndices = [3, 0, 1, 2, 10, 4, 9, 6, 7, 8, 11, 5]

// xMoveTranslation maps moves from the Y axis phase-1 cube to moves on the X
// axis cube. The mapping is: F->F, B->B, U->R, D->L, L->U, R->D.
// For example, doing U on a Y-axis cube is like doing R on the X-axis version
// of that cube.
// This mapping is kind of like doing a "z" rotation before the move.
var xMoveTranslation = [4, 5, 2, 3, 1, 0, 10, 11, 8, 9, 7, 6, 16, 17, 14, 15,
  13, 12];

// zCornerIndices are like xCornerIndices but for the Z axis cube.
var zCornerIndices = [2, 3, 6, 7, 0, 1, 4, 5]

// zEdgeIndices are like xEdgeIndices but for the Z axis cube.
var zEdgeIndices = [2, 11, 8, 10, 3, 1, 0, 5, 6, 4, 9, 7]

// zMoveTranslation is like xMoveTranslation, but it's for doing an "x" rotation
// before applying a move. The mapping is: R->R, L->L, F->U, B->D, U->B, D->F.
var zMoveTranslation = [3, 2, 0, 1, 4, 5, 9, 8, 6, 7, 10, 11, 15, 14, 12, 13,
  16, 17];

// A Phase1Cube is an efficient way to represent the parts of a cube which
// matter for the first phase of Kociemba's algorithm.
// The FB edge orientation can be used for both Y and X phase-1 goals, and the
// UD edge orientation can be used for the Z phase-1 goal. Thus, no RL edge
// orientations are needed.
function Phase1Cube() {
  // These are the initial corner orientations.
  this.xCO = 1093;
  this.yCO = 1093;
  this.zCO = 1093;
  
  // These are the initial edge orientations.
  this.fbEO = 0;
  this.udEO = 0;
  
  // These are the initial slice permutations.
  this.mSlice = 220;
  this.eSlice = 220;
  this.sSlice = 220;
}

// anySolved returns true if the phase-1 state is solved along any axis.
Phase1Cube.prototype.anySolved = function() {
  if (this.xCO === 1093 && this.mSlice === 220 && this.fbEO === 0) {
    return true;
  } else if (this.yCO === 1093 && this.eSlice === 220 && this.fbEO === 0) {
    return true;
  } else if (this.zCO === 1093 && this.sSlice === 220 && this.udEO === 0) {
    return true;
  }
  return false;
};

// solved returns an array with three booleans, [x, y, z], which indicates
// whether any axis is solved for phase-1.
Phase1Cube.prototype.solved = function() {
  var x = true;
  var y = true;
  var z = true;
  if (p.xCO !== 1093) {
    x = false;
  } else if (p.mSlice !== 220) {
    x = false;
  } else if (p.fbEO !== 0) {
    x = false;
  }
  if (p.yCO !== 1093) {
    y = false;
  } else if (p.eSlice !== 220) {
    y = false;
  } else if (p.fbEO !== 0) {
    y = false;
  }
  if (p.zCO !== 1093) {
    z = false;
  } else if (p.sSlice !== 220) {
    z = false;
  } else if (p.udEO !== 0) {
    z = false;
  }
  return [x, y, z];
};

// xEO returns the fbEO, translated for the X axis cube.
Phase1Cube.prototype.xEO = function() {
  var res = 0;
  
  // Translate the EO bitmap, noting that xEdgeIndices[10] is 11 and is thus
  // never set in the FB bitmap.
  var parity = false;
  for (var i = 0; i < 10; ++i) {
    var idx = xEdgeIndices[i];
    if ((p.fbEO & (1 << idx)) !== 0) {
      res |= 1 << i;
      parity = !parity;
    }
  }
  
  // If the last thing in the translated bitmap would be a 1, flip the parity.
  if ((p.fbEO & (1 << xEdgeIndices[11])) !== 0) {
    parity = !parity;
  }
  
  // If there is parity, then the missing element (i.e. #10) is 1.
  if (parity) {
    res |= 1 << 10;
  }
  
  return res;
};
