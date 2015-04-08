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
    var corners = new Corners();
    for (var j = 0; j < 8; ++j) {
      corners.corners[j].piece = perm[j];
    }
    
    // Loop through all 10 moves and apply them.
    for (var m = 0; m < 10; ++m) {
      if (this.cornerMoves[state*10 + m] !== 0xffff) {
        continue;
      }
      
      // Record the end state of this move.
      var c = corners.copy();
      c.move(p2MoveMove(m, 1));
      var endState = encodeYCornerPerm(c);
      res.cornerMoves[state*10 + m] = endState;
      
      // Set the inverse of this state.
      res.cornerMoves[endState*10 + p2MoveInverse(m)] = state;
    }
  }
};

Phase2Moves.prototype._generateEdgeMoves = function(perm8) {
  // TODO: this
};

Phase2Moves.prototype._generateSliceMoves = function() {
  // TODO: this
};

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