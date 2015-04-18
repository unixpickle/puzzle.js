// cancelMoves performs move cancellation on a sequence of moves. The result is
// returned and the original array is not modified.
function cancelMoves(moves) {
  var res = moves.slice();
  
  // TODO: remove redundancies like L R L'.
  
  // Loop through each move and make sure it has a different face than the move
  // before it.
  var lastFace = 0;
  for (var i = 0; i < res.length; ++i) {
    var face = res[i].face();
    if (face === lastFace) {
      // Figure out the new move (or delete the move altogether).
      var turns = res[i-1].turns() + res[i].turns();
      res.splice(i, 1);
      --i;
      if (turns === 1) {
        res[i] = new Move(face - 1);
      } else if (turns === 2 || turns === -2) {
        res[i] = new Move(face + 11);
      } else if (turns === -1 || turns === 3) {
        res[i] = new Move(face + 5);
      } else {
        // The moves directly cancelled each other out.
        res.splice(i, 1);
        --i;
        lastFace = (i === -1 ? 0 : res[i].face());
        continue;
      }
    }
    lastFace = face;
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