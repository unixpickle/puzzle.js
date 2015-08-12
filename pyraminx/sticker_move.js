// A StickerMove represents a face turn or a tip twist on the Pyraminx.
//
// The corner of a move is a number between 0 and 3 (inclusive), corresponding to the R, L, U and B
// corners respectively.
//
// The tip should be true if this move should only be performed on the outer tip.
function StickerMove(corner, clockwise, tip) {
  this.corner = corner;
  this.clockwise = clockwise;
  this.tip = tip;
}

// toString returns the move, represented in WCA notation.
StickerMove.prototype.toString = function() {
  var cornerName = ['R', 'L', 'U', 'B'][this.corner];
  if (this.tip) {
    cornerName = cornerName.toLowerCase();
  }
  return cornerName + (this.clockwise ? '' : "'");
};

// stickerMovesToString converts an array of StickerMoves to a string.
function stickerMovesToString(moves) {
  return moves.join(' ');
}

// parseStickerMove parses a WCA move string and returns the given move.
// If the move is invalid, this will throw an exception.
function parseStickerMove(str) {
  try {
    var regularMove = parseMove(str.toUpperCase());
  } catch (e) {
    // We catch the error and re-throw it because the move string in the exception from parseMove()
    // will be converted to upper-case.
    throw new Error('invalid move: ' + str);
  }
  var tip = (str !== str.toUpperCase());
  return new StickerMove(regularMove.corner, regularMove.clockwise, tip);
}

// parseStickerMoves parses a space-separated string of sticker moves.
// If any move is invalid, this will throw an exception.
function parseStickerMoves(str) {
  var comps = str.split(' ');
  var moves = [];
  for (var i = 0, len = comps.length; i < len; ++i) {
    moves.push(parseStickerMove(comps[i]));
  }
  return moves;
}

exports.StickerMove = StickerMove;
exports.stickerMovesToString = stickerMovesToString;
exports.parseStickerMove = parseStickerMove;
exports.parseStickerMoves = parseStickerMoves;
