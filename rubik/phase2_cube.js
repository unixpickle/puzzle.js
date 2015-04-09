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
      res.cornerMoves[state*10 + m] = endState;
      
      // Set the inverse of this state.
      res.cornerMoves[endState*10 + p2MoveInverse(m)] = state;
    }
  }
};

Phase2Moves.prototype._generateEdgeMoves = function(perm8) {
  for (var i = 0; i < 403200; ++i) {
    this.edgeMoves[i] = 0xffff;
  }
  
  // Apply every move to every edge state.
  for (var state = 0; state < 40320; ++state) {
    var perm = perm8[state];
    var edges = new Edges();
    // Permute the UD edges for the current case.
    for (var j = 0; j < 8; ++j) {
      var slot = [6, 5, 0, 4, 8, 11, 2, 10][j];
      var piece = [6, 5, 0, 4, 8, 11, 2, 10][perm[j]];
      edges[slot].piece = piece;
    }
    // Apply all 10 moves to the cube.
    for (var m = 0; m < 10; ++m) {
      if (this.edgeMoves[state*10 + m] !== 0xffff) {
        continue;
      }
      
      var e = edges.copy();
      e.move(p2MoveMove(m, 1));
      var endState = encodeUDEdges(e);
      this.edgeMoves[state*10 + m] = endState;
      
      // Set the inverse of this state.
      this.edgeMoves[endState*10 + p2MoveInverse(m)] = state;
    }
  }
};

Phase2Moves.prototype._generateSliceMoves = function() {
  // TODO: this
};

function encodeUDEdges(edges) {
  // TODO: this
}

function encodeYCornerPerm(corners) {
  // TODO: this
}

function moveYCornerPerm(perm, move) {
  var p = perm.splice();
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

// p2MoveFace returns the face of a phase-2 move.
function p2MoveFace(m) {
  return [2, 3, 4, 5, 0, 0, 0, 1, 1, 1][m] + 1;
}

// p2MoveInverse finds the inverse of a phase-2 move.
function p2MoveInverse(m) {
  return [0, 1, 2, 3, 5, 4, 6, 8, 7, 9][m];
}

// p2MoveMove returns the Move for a phase-2 move.
function p2MoveMove(m, axis) {
  var num = [
    [14, 15, 12, 13, 5, 11, 17, 4, 10, 16],
		[14, 15, 16, 17, 0, 6, 12, 1, 7, 13],
		[13, 12, 16, 17, 2, 8, 14, 3, 9, 15]
  ][axis][m];
}
