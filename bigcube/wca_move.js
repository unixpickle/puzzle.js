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
  var turnsStr = ['', '2', "'"][this.turns];
  if (this.width === 1) {
    return this.face + turnsStr;
  }
  return this.width + this.face + 'w' + turnsStr;
};

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
        if (!threeGen) {
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
exports.wcaMoveBasis = wcaMoveBasis;
exports.wcaMovesToString = wcaMovesToString;
