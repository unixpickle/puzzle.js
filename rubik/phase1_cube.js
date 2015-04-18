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

// These constants store the number of states for each coordinate.
var PHASE1_CO_COUNT = 2187;
var PHASE1_EO_COUNT = 2048;
var PHASE1_SLICE_COUNT = 495;

// These constants store the solved value for each coordinate.
var PHASE1_SOLVED_CO = 1093;
var PHASE1_SOLVED_EO = 0;
var PHASE1_SOLVED_SLICE = 220;

// A Phase1Cube holds and operates on the coordinates for one phase-1 axis of a
// cube.
function Phase1Cube(co, eo, slice) {
  this.co = co || PHASE1_SOLVED_CO;
  this.eo = eo || PHASE1_SOLVED_EO;
  this.slice = slice || PHASE1_SOLVED_SLICE;
}

// copy generates a copy of this Phase1Cube and returns it.
Phase1Cube.prototype.copy = function() {
  return new Phase1Cube(this.co, this.eo, this.slice);
};

// move applies a move number to this cube given a set of move tables.
Phase1Cube.prototype.move = function(move, moves) {
  this.co = moves.co[this.co*18 + move];
  this.eo = moves.eo[this.eo*18 + move];
  this.slice = moves.slice[this.slice*18 + move];
};

// set sets the attributes of this cube to be the attributes of a given cube.
Phase1Cube.prototype.set = function(c) {
  this.co = c.co;
  this.eo = c.eo;
  this.slice = c.slice;
};

// solved returns true if and only if the phase-1 state is solved.
Phase1Cube.prototype.solved = function() {
  // I do not use constants like PHASE1_SOLVED_EO here because global variables
  // hurt performance, and this is a hot function during searches.
  return this.co === 1093 && this.slice === 220 && this.eo === 0;
};

// A Phase1AxisCubes object operates simultaneously on all three phase-1 cubes.
// The optional argument, a CubieCube, can be supplied to convert a CubieCube to
// a Phase1AxisCube.
function Phase1AxisCubes(cc) {
  if ('undefined' === typeof cc) {
    this.x = new Phase1Cube();
    this.y = new Phase1Cube();
    this.z = new Phase1Cube();
  } else {
    var xzCO = encodeXZCO(cc.corners);
    var yCO = encodeYCO(cc.corners);
    
    var yEO = encodeYEO(cc.edges);
    var xEO = convertYEOToXEO(yEO);
    var zEO = encodeZEO(cc.edges);
    
    var msSlices = encodeMSSlice(cc.edges)
    var eSlice = encodeESlice(cc.edges);
    
    this.x = new Phase1Cube(xzCO[0], xEO, msSlices[0]);
    this.y = new Phase1Cube(yCO, yEO, eSlice);
    this.z = new Phase1Cube(xzCO[1], zEO, msSlices[1]);
  }
}

// anySolved returns true if any three of the axis cubes are solved.
Phase1AxisCubes.prototype.anySolved = function() {
  return this.x.solved() || this.y.solved() || this.z.solved();
};

// copy generates a copy of all three axes and returns it.
Phase1AxisCubes.prototype.copy = function() {
  var res = new Phase1AxisCubes();
  res.x.set(this.x);
  res.y.set(this.y);
  res.z.set(this.z);
  return res;
};

// move applies a move to all three axes.
Phase1AxisCubes.prototype.move = function(move, moves) {
  var number = move.number;
  this.y.move(number, moves);
  this.z.move(zMoveTranslation[number], moves);
  this.x.move(xMoveTranslation[number], moves);
};

// set updates the object's fields to represent another Phase1AxisCubes.
Phase1AxisCubes.prototype.set = function(c) {
  this.x.set(c.x);
  this.y.set(c.y);
  this.z.set(c.z);
};

// solved returns an array with three booleans, corresponding to whether the x,
// y, or z cubes are solved respectively.
Phase1AxisCubes.prototype.solved = function() {
  return [this.x.solved(), this.y.solved(), this.z.solved()];
};

// Phase1Moves is a table containing the necessary data to efficiently perform
// moves on a Phase1Cube.
function Phase1Moves() {
  this.slice = new Int16Array(495 * 18);
  this.eo = new Int16Array(2048 * 18);
  this.co = new Int16Array(2187 * 18);
  
  this._generateCO();
  this._generateEO();
  this._generateESlice();
}

Phase1Moves.prototype._generateCO = function() {
  for (var i = 0; i < 2187*18; ++i) {
    this.co[i] = -1;
  }
  
  for (var i = 0; i < 2187; ++i) {
    var corners = decodeCO(i);
    for (var move = 0; move < 18; ++move) {
      if (this.co[i*18 + move] >= 0) {
        continue;
      }
      
      // Set the end state in the table.
      var aCase = corners.copy();
      aCase.move(new Move(move));
      var endState = encodeYCO(aCase);
      this.co[i*18 + move] = endState;
      
      // Set the inverse in the table.
      this.co[endState*18 + new Move(move).inverse().number] = i;
    }
  }
};

Phase1Moves.prototype._generateEO = function() {
  for (var i = 0; i < 2048*18; ++i) {
    this.eo[i] = -1;
  }
  
  for (var i = 0; i < 2048; ++i) {
    var edges = decodeEO(i);
    for (var move = 0; move < 18; ++move) {
      if (this.eo[i*18 + move] >= 0) {
        continue;
      }
      
      // Set the end state in the table.
      var aCase = edges.copy();
      aCase.move(new Move(move));
      var endState = encodeYEO(aCase);
      this.eo[i*18 + move] = endState;
      
      // Set the inverse in the table.
      this.eo[endState*18 + new Move(move).inverse().number] = i;
    }
  }
};

Phase1Moves.prototype._generateESlice = function() {
  for (var i = 0; i < 495*18; ++i) {
    this.slice[i] = -1;
  }
  
  // Generate the E slice cases by looping through all the possible ways to
  // choose 4 elements from a set of 12.
  var sliceCase = 0;
  for (var w = 0; w < 12; ++w) {
    for (var x = w + 1; x < 12; ++x) {
      for (var y = x + 1; y < 12; ++y) {
        for (var z = y + 1; z < 12; ++z) {
          // Create a state which has bogus edges at the slice indices.
          var state = new Edges();
          state.edges[w].piece = -1;
          state.edges[x].piece = -1;
          state.edges[y].piece = -1;
          state.edges[z].piece = -1;
          for (var move = 0; move < 18; ++move) {
            if (this.slice[sliceCase*18 + move] >= 0) {
              continue;
            }
            
            // Set the end state in the table.
            var aCase = state.copy();
            aCase.move(new Move(move));
            var encoded = encodeBogusSlice(aCase);
            this.slice[sliceCase*18 + move] = encoded;
            
            // Set the inverse in the table.
            this.slice[encoded*18 + new Move(move).inverse().number] =
              sliceCase;
          }
          ++sliceCase;
        }
      }
    }
  }
};

// convertYEOToXEO converts a y-axis EO case to the x axis.
function convertYEOToXEO(yEO) {
  var res = 0;
  
  // Translate the EO bitmap, noting that xEdgeIndices[10] is 11 and is thus
  // never set in the FB bitmap.
  var parity = 0;
  for (var i = 0; i < 10; ++i) {
    var idx = xEdgeIndices[i];
    if ((yEO & (1 << idx)) !== 0) {
      res |= 1 << i;
      parity ^= 1;
    }
  }
  
  // If the last thing in the translated bitmap would be a 1, flip the parity.
  if ((yEO & (1 << xEdgeIndices[11])) !== 0) {
    parity ^= 1;
  }
  
  // If there is parity, then the missing element (i.e. #10) is 1.
  res |= parity << 10;
  
  return res;
}

// decodeCO generates Corners which represent a given CO case.
function decodeCO(co) {
  var c = new Corners();
  
  // Compute the orientations of the first 7 corners.
  var scaler = 1;
  for (var x = 0; x < 7; ++x) {
    c.corners[x].orientation = Math.floor(co / scaler) % 3;
    scaler *= 3;
  }
  
  // Compute the last corner's orientation.
  // The way this works is based on the fact that a sune combo which twists two
  // adjacent corners is all that is necessary to generate any corner
  // orientation case.
  var ordering = [0, 1, 5, 4, 6, 2, 3, 7];
  var orientations = [];
  for (var i = 0; i < 8; ++i) {
    orientations[i] = c.corners[ordering[i]].orientation;
  }
  for (var i = 0; i < 7; ++i) {
    var thisOrientation = orientations[i];
    var nextOrientation = orientations[i+1];
    // Twist thisOrientation to be solved, affecting the next corner in the
    // sequence.
    if (thisOrientation === 2) {
      // y -> x, x -> z, z -> y
      orientations[i+1] = (nextOrientation + 2) % 3;
    } else if (thisOrientation === 0) {
      // z -> x, x -> y, y -> z
      orientations[i+1] = (nextOrientation + 1) % 3;
    }
  }
  // The twist of the last corner is the inverse of what it should be in the
  // scramble.
  if (orientations[7] === 0) {
    c.corners[7].orientation = 2;
  } else if (orientations[7] === 2) {
    c.corners[7].orientation = 0;
  }
  
  return c;
}

// decodeEO generates Edges which represent a given EO case.
function decodeEO(eo) {
  var edges = new Edges();
  var parity = false;
  for (var x = 0; x < 11; ++x) {
    if ((eo & (1 << x)) !== 0) {
      parity = !parity;
      edges.edges[x].flip = true;
    }
  }
  edges.edges[11].flip = parity;
  return edges;
}

// encodeBogusSlice encodes a slice permutation case, treating pieces with
// values of "-1" as E slice edges.
function encodeBogusSlice(edges) {
  var list = [];
  for (var i = 0; i < 12; ++i) {
    list[i] = (edges.edges[i].piece === -1);
  }
  return perms.encodeChoose(list);
}

// encodeYCO encodes the CO case of a given set of Corners.
function encodeYCO(c) {
  var res = 0;
  var scaler = 1;
  for (var i = 0; i < 7; ++i) {
    res += scaler * c.corners[i].orientation;
    scaler *= 3;
  }
  return res;
}

// encodeESlice encodes the E slice of a given set of Edges.
function encodeESlice(edges) {
  var list = [];
  for (var i = 0; i < 12; ++i) {
    var piece = edges.edges[i].piece;
    if (piece === 1 || piece === 3 || piece === 7 || piece === 9) {
      list[i] = true;
    } else {
      list[i] = false;
    }
  }
  return perms.encodeChoose(list);
}

// encodeMSSlice encodes the M and S slices of Edges.
function encodeMSSlice(edges) {
  var mChoice = [];
  var sChoice = [];
  for (var i = 0; i < 12; ++i) {
    var idx = xEdgeIndices[i];
    var p = edges.edges[idx].piece;
    if (p === 0 || p === 2 || p === 6 || p === 8) {
      mChoice[i] = true;
    } else {
      mChoice[i] = false;
    }
  }
  for (var i = 0; i < 12; ++i) {
    var idx = zEdgeIndices[i];
    var p = edges.edges[idx].piece;
    if (p === 4 || p === 5 || p === 10 || p === 11) {
      sChoice[i] = true;
    } else {
      sChoice[i] = false;
    }
  }
  return [perms.encodeChoose(mChoice), perms.encodeChoose(sChoice)];
}

// encodeXZCO encodes the CO of Corners on the X and Z axes.
function encodeXZCO(corners) {
  var x = [];
  var z = [];
  var xVal = 0;
  var zVal = 0;
  
  // For each corner, find the direction of the x and z stickers.
  for (var i = 0; i < 8; ++i) {
    var corner = corners.corners[i];
    
    // If the corner was in its original slot, here's what the directions
    // would be.
    var o = corner.orientation;
    if (o === 0) {
      x[i] = 2;
      z[i] = 1;
    } else if (o === 1) {
      x[i] = 0;
      z[i] = 2;
    } else {
      x[i] = 1;
      z[i] = 0;
    }

    // If it takes an odd number of quarter turns to move the corner back to
    // its original slot, swap x and z.
    var d = (corner.piece ^ i) & 7;
    if (d === 1 || d === 2 || d === 4 || d === 7) {
      var oldX = x[i];
      x[i] = z[i];
      z[i] = oldX;
    }
  }
  
  // Add the information together to generate the final values.
  var scaler = 1;
  for (var i = 0; i < 7; ++i) {
    var xDirection = x[xCornerIndices[i]];
    if (xDirection === 1) {
      xDirection = 0;
    } else if (xDirection === 0) {
      xDirection = 1;
    }
    xVal += scaler * xDirection;
    
    var zDirection = z[zCornerIndices[i]];
    if (zDirection === 1) {
      zDirection = 2;
    } else if (zDirection === 2) {
      zDirection = 1;
    }
    zVal += scaler * zDirection;
    
    scaler *= 3;
  }
  
  return [xVal, zVal];
}

// encodeYEO encodes the EO case of a given set of Edges.
function encodeYEO(e) {
  var res = 0;
  for (var i = 0; i < 11; ++i) {
    if (e.edges[i].flip) {
      res |= (1 << i);
    }
  }
  return res;
}

// encodeZEO encodes the EO cases for the z-axis cube.
function encodeZEO(edges) {
  var res = 0;
  for (var i = 0; i < 11; ++i) {
    var idx = zEdgeIndices[i];
    var edge = edges.edges[idx];
    var flip = edge.flip;
    var p = edge.piece
    if (p === 0 || p === 2 || p === 6 || p === 8) {
      // This is an M slice edge piece, so it changes orientation if it
      // was on the S slice or the E slice.
      if (idx !== 0 && idx !== 2 && idx !== 6 && idx !== 8) {
        flip = !flip;
      }
    } else {
      // This is an E or S slice edge, so it changes orientation if it
      // was on the M slice.
      if (idx === 0 || idx === 2 || idx === 6 || idx === 8) {
        flip = !flip
      }
    }
    if (flip) {
      res |= 1 << i;
    }
  }
  return res;
}

exports.Phase1AxisCubes = Phase1AxisCubes;
exports.Phase1Cube = Phase1Cube;
exports.Phase1Moves = Phase1Moves;
