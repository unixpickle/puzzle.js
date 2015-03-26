var _allMovesList;

function Move(face, turns) {
  this.face = face;
  this.turns = turns;
}

Move.prototype.axis = function() {
  return [-1, 1, 1, 2, 2, 0, 0][this.face];
};

Move.prototype.inverse = function() {
  if (this.turns === 2) {
    return this;
  } else {
    return new Move(this.face, -this.turns);
  }
};

Move.prototype.toString = function() {
  var faces = 'UDFBRL';
  var face = faces[this.face - 1];
  if (this.turns === 1) {
    return face;
  } else if (this.turns === 2) {
    return face + '2';
  } else {
    return face + "'";
  }
};

function allMoves() {
  return _allMovesList.slice();
}

function basisMoves() {
  return _basisMovesList.slice();
}

function movesToString(moves) {
  return moves.join(' ');
}

function parseMove(s) {
  if (s.length === 1) {
    var faces = ['U', 'D', 'F', 'B', 'R', 'L'];
    var face = faces.indexOf(s);
    if (face < 0) {
      throw new Error('Invalid move: ' + s);
    }
    return new Move(face+1, 1);
  } else if (s.length === 2) {
    var res = parseMove(s[0]);
    if (s[1] === '2') {
      res.turns = 2;
    } else if (s[1] === "'") {
      res.turns = -1;
    } else {
      throw new Error('Invalid move: ' + s);
    }
    return res;
  } else {
    throw new Error('Invalid move: ' + s);
  }
}

function parseMoves(s) {
  var parts = s.split(' ');
  var res = [];
  for (var i = 0, len = parts.length; i < len; ++i) {
    res[i] = parseMove(parts[i]);
  }
  return res;
}

function scrambleMoves(count) {
  // Faces 1, 3, and 5 are U, F, and R respectively.
  var moves = [];
  var lastFace = 0;
  for (var i = 0; i < count; ++i) {
    var faces = [1, 3, 5];
    if (i > 0) {
      faces.splice(faces.indexOf(lastFace), 1);
    }
    var face = faces[Math.floor(Math.random() * faces.length)];
    var turns = Math.floor(Math.random()*3) || -1;
    moves.push(new Move(face, turns));
    lastFace = face;
  }
  return moves;
}

// Generate a list of every move, ordered by comfort.
_allMovesList = parseMoves("R R' L L' U U' D D' R2 L2 U2 D2 F2 B2 F " +
  "F' B B'");

// Generate a list of the standard basis moves.
_basisMovesList = parseMoves("R R' R2 U U' U2 F F' F2");

exports.Move = Move;
exports.allMoves = allMoves;
exports.basisMoves = basisMoves;
exports.movesToString = movesToString;
exports.parseMove = parseMove;
exports.parseMoves = parseMoves;
exports.scrambleMoves = scrambleMoves;
