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
  // The moves are ordered in descending comfort.
  return _allMovesList.slice();
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

// Generate a list of every move, ordered by comfort.
_allMovesList = parseMoves("R R' L L' U U' D D' R2 L2 U2 D2 F2 B2 F " +
  "F' B B'");

exports.Move = Move;
exports.allMoves = allMoves;
exports.movesToString = movesToString;
exports.parseMove = parseMove;
exports.parseMoves = parseMoves;
