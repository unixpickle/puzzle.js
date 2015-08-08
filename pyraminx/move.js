// A Move represents a face turn on the Pyraminx.
//
// The corner of a move is a number between 0 and 3 (inclusive), corresponding to the R, L, U and B
// corners respectively.
function Move(corner, clockwise) {
  this.corner = corner;
  this.clockwise = clockwise;
}

// toString returns the move, represented in WCA notation.
Move.prototype.toString = function() {
  var cornerName = ['R', 'L', 'U', 'B'][this.corner];
  return cornerName + (this.clockwise ? '' : "'");
};

// allMoves returns all the possible moves which can be done on a Pyraminx.
function allMoves() {
  return parseMoves("R L U B R' L' U' B'");
}

// movesToString converts an array of moves to a string.
function movesToString(moves) {
  return moves.join(' ');
}

// parseMove parses a WCA move string and returns the given move.
// If the move is invalid, this will throw an exception.
function parseMove(str) {
  if (str.length === 1) {
    var corners = ['R', 'L', 'U', 'B'];
    var corner = corners.indexOf(str);
    if (corner < 0) {
      throw new Error('Invalid move: ' + str);
    }
    return new Move(corner, true);
  } else if (str.length === 2) {
    if (str[1] !== "'") {
      throw new Error('Invalid move: ' + str);
    }
    var res = parseMove(str[0]);
    res.clockwise = false;
    return res;
  } else {
    throw new Error('Invalid move: ' + str);
  }
}

// parseMoves parses a space-separated string of moves.
// If any move is invalid, this will throw an exception.
function parseMoves(str) {
  var comps = str.split(' ');
  var moves = [];
  for (var i = 0, len = comps.length; i < len; ++i) {
    moves.push(parseMove(comps[i]));
  }
  return moves;
}

// randomTipMoves generates moves which create random tip twists.
function randomTipMoves() {
  var moves = [];
  var tipNames = ['u', 'l', 'r', 'b']
  for (var tipIndex = 0; tipIndex < 4; ++tipIndex) {
    var count = Math.floor(Math.random() * 3);
    if (count === 0) {
      continue;
    } else if (count === 1) {
      moves.push(tipNames[tipIndex]);
    } else {
      moves.push(tipNames[tipIndex] + "'");
    }
  }
  return moves.join(' ');
}

exports.Move = Move;
exports.allMoves = allMoves;
exports.movesToString = movesToString;
exports.parseMove = parseMove;
exports.parseMoves = parseMoves;
exports.randomTipMoves = randomTipMoves;
