// A WCAMove represents a wide turn on an NxNxN cube.
function WCAMove(face, width, turns) {
  this.face = face;
  this.width = width;
  this.turns = turns;
}

// axis returns 0 for R and L, 1 for U and D, and 2 for F and B.
WCAMove.prototype.axis = function() {
  return {
    'R': 0,
    'L': 0,
    'U': 1,
    'D': 1,
    'F': 2,
    'B': 2
  }[this.face];
};

// toString converts this move to a WCA move string.
WCAMove.prototype.toString = function() {
  var turnsStr = ['', '2', "'"][this.turns - 1];
  if (this.width === 1) {
    return this.face + turnsStr;
  }
  return this.width + this.face + 'w' + turnsStr;
};

function parseWCAMove(str) {
  var match = /([0-9]*)(U|D|F|B|R|L)w?(2|')?/.exec(str);
  if (match === null) {
    throw new Error('invalid move: ' + str);
  }
  var width = parseInt(match[1] || 1);
  var face = match[2];
  var countStr = (match[3] || '');
  var turns = 1;
  if (countStr === '2') {
    turns = 2;
  } else if (countStr === "'") {
    turns = 3;
  }
  return new WCAMove(face, width, turns);
}

function parseWCAMoves(str) {
  var moveStrings = str.split(' ');
  var result = [];
  for (var i = 0, len = moveStrings.length; i < len; ++i) {
    result[i] = parseWCAMove(moveStrings[i]);
  }
  return result;
}

function wcaMoveBasis(size) {
  if (size < 2) {
    throw new Error('cube is too small');
  }

  var maxWidth = (size >>> 1);
  var threeGen = ((size & 1) === 0);
  var primaryFacesForAxes = ['R', 'U', 'F'];
  var secondaryFacesForAxes = ['L', 'D', 'B'];

  var basis = [];
  for (var width = 1; width <= maxWidth; ++width) {
    for (var turns = 1; turns <= 3; ++turns) {
      for (var axis = 0; axis < 3; ++axis) {
        basis.push(new WCAMove(primaryFacesForAxes[axis], width, turns));
        if (!threeGen || width < maxWidth) {
          basis.push(new WCAMove(secondaryFacesForAxes[axis], width, turns));
        }
      }
    }
  }
  return basis;
}

function wcaMovesToString(moves) {
  return moves.join(' ');
}

exports.WCAMove = WCAMove;
exports.parseWCAMove = parseWCAMove;
exports.parseWCAMoves = parseWCAMoves;
exports.wcaMoveBasis = wcaMoveBasis;
exports.wcaMovesToString = wcaMovesToString;
