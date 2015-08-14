// combinedMovesOnSameFace takes two moves which affect the same face and returns a move that
// represents their product.
// If the moves were inverses, this returns null.
function combinedMovesOnSameFace(m1, m2) {
  var turns = m1.turns() + m2.turns();
  var face = m1.face();
  if (m2.face() !== m1.face()) {
    throw new Error('combineMovesOnSameFace only works for moves on the same face');
  }
  if (turns === 1) {
    return new Move(face - 1);
  } else if (turns === 2 || turns === -2) {
    return new Move(face + 11);
  } else if (turns === -1 || turns === 3) {
    return new Move(face + 5);
  } else {
    return null;
  }
}

// cancelMoves performs move cancellation on a sequence of moves. The result is returned and the
// original array is not modified.
function cancelMoves(moves) {
  var res = moves.slice();
  
  for (var i = 0; i < res.length; ++i) {
    var move = res[i];
    if (i > 0 && move.face() === res[i-1].face()) {
      var newMove = combinedMovesOnSameFace(move, res[i-1]);
      if (newMove === null) {
        res.splice(i-1, 2);
        i -= 2;
      } else {
        res[i-1] = newMove;
        res.splice(i, 1);
        --i;
      }
    } else if (i > 1 && move.axis() === res[i-1].axis() && move.axis() === res[i-2].axis()) {
      // NOTE: this deals with cases like "L R L2" or "U D U'".
      var newMove = combinedMovesOnSameFace(move, res[i-2]);
      if (newMove === null) {
        res.splice(i, 1);
        res.splice(i-2, 1);
      } else {
        res.splice(i, 1);
        res[i-2] = newMove;
      }
      // TODO: see if this could be i -= 2. I think it could be, but I am too lazy to prove it.
      i -= 3;
    }
  }

  return res;
}

function scrambleMoves(len) {
  var axis = -1;
  var moves = allMoves();
  var result = [];

  for (var i = 0; i < len; ++i) {
    // Pick a random move
    var moveIdx = Math.floor(Math.random() * moves.length);
    var move = moves[moveIdx];

    // Reset the moves and the axis if necessary.
    if (move.axis() !== axis) {
      axis = move.axis();
      moves = allMoves();
    }

    // Remove all moves which affect this face to prevent redundant moves.
    for (var j = 0; j < moves.length; ++j) {
      if (moves[j].face() === move.face()) {
        moves.splice(j, 1);
        --j;
      }
    }

    result[i] = move;
  }

  return result;
}

exports.cancelMoves = cancelMoves;
exports.scrambleMoves = scrambleMoves;
