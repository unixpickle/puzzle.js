// wcaMoveScramble generates a move scramble for a big cube.
function wcaMoveScramble(cubeSize, moveCount) {
  var basis = wcaMoveBasis(cubeSize);
  var currentBasis = basis.slice();
  var scramble = [];
  var lastAxis = -1;
  for (var i = 0; i < moveCount; ++i) {
    var move = currentBasis[Math.floor(Math.random() * currentBasis.length)];
    scramble.push(move);

    if (move.axis() !== lastAxis) {
      currentBasis = basis.slice();
      lastAxis = move.axis();
    }

    for (var j = 0; j < currentBasis.length; ++j) {
      var aMove = currentBasis[j];
      if (aMove.face === move.face && aMove.width === move.width) {
        currentBasis.splice(j, 1);
        --j;
      }
    }
  }
  return scramble;
}

exports.wcaMoveScramble = wcaMoveScramble;
