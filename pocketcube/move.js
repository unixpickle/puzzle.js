var _basisMovesList;

// A Move represents a WCA move on the pocketcube. 
// A move can occur on the faces U, D, F, B, R, and L. These are the first 6
// values of the Move type. The next 6 values are U', D', F', B', R', L'. The
// final six values are U2, D2, F2, B2, R2, L2. Thus, there are a total of 18
// possible moves in the range [0, 18).
function Move(number) {
  this.number = number;
}

// axis returns the number 0, 1, or 2 corresponding to the face. The 0 axis
// corresponds to L and R. The 1 axis corresponds to U and D. The 2 axis
// corresponds to F and B.
Move.prototype.axis = function() {
  return [-1, 1, 1, 2, 2, 0, 0][this.face()];
};

// face returns the face of the move, which will be in the range [1, 6]
// corresponding to U, D, F, B, R, and L respectively.
Move.prototype.face = function() {
  return (this.number % 6) + 1;
};

// inverse returns the inverse of the move.
Move.prototype.inverse = function() {
  if (this.number < 6) {
    return new Move(this.number + 6);
  } else if (this.number < 12) {
    return new Move(this.number - 6);
  } else {
    return this;
  }
};

// toString generates a WCA move from this move.
Move.prototype.toString = function() {
  var faces = 'UDFBRL';
  var face = faces[this.face() - 1];
  if (this.turns() === 1) {
    return face;
  } else if (this.turns() === 2) {
    return face + '2';
  } else {
    return face + "'";
  }
};

// turns returns the number of turns represented by the move. This may be 1, -1,
// or 2.
Move.prototype.turns = function() {
  if (this.number < 6) {
    return 1;
  } else if (this.number < 12) {
    return -1;
  } else {
    return 2;
  }
};

// allMoves returns all the moves, sequentially.
function allMoves() {
  var res = [];
  for (var i = 0; i < 18; ++i) {
    res[i] = new Move(i);
  }
  return res;
}

// basisMoves returns the moves which are necessary to generate every unrotated
// state on the cube.
function basisMoves() {
  return _basisMovesList.slice();
}

// movesToString generates a WCA string from an array of moves.
function movesToString(moves) {
  return moves.join(' ');
}

// parseMove parses a move from a WCA string.
function parseMove(s) {
  if (s.length === 1) {
    var faces = ['U', 'D', 'F', 'B', 'R', 'L'];
    var face = faces.indexOf(s);
    if (face < 0) {
      throw new Error('Invalid move: ' + s);
    }
    return new Move(face);
  } else if (s.length === 2) {
    var res = parseMove(s[0]);
    if (s[1] === '2') {
      return new Move(res.number + 12);
    } else if (s[1] === "'") {
      return new Move(res.number + 6);
    } else {
      throw new Error('Invalid move: ' + s);
    }
  } else {
    throw new Error('Invalid move: ' + s);
  }
}

// parseMoves parses a space-separated list of WCA moves.
function parseMoves(s) {
  var parts = s.split(' ');
  var res = [];
  for (var i = 0, len = parts.length; i < len; ++i) {
    res[i] = parseMove(parts[i]);
  }
  return res;
}

// scrambleMoves generates a random list of basis moves.
function scrambleMoves(count) {
  // Faces 1, 3, and 5 are U, F, and R respectively.
  var moves = [];
  var lastFace = 0;
  for (var i = 0; i < count; ++i) {
    var faces = [0, 2, 4];
    if (i > 0) {
      faces.splice(faces.indexOf(lastFace), 1);
    }
    var face = faces[Math.floor(Math.random() * faces.length)];
    var turns = Math.floor(Math.random()*3) * 6;
    moves.push(new Move(turns + face));
    lastFace = face;
  }
  return moves;
}

// Generate a list of the standard basis moves.
_basisMovesList = parseMoves("R R' R2 U U' U2 F F' F2");

exports.Move = Move;
exports.allMoves = allMoves;
exports.basisMoves = basisMoves;
exports.movesToString = movesToString;
exports.parseMove = parseMove;
exports.parseMoves = parseMoves;
exports.scrambleMoves = scrambleMoves;
