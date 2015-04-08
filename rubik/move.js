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

exports.scrambleMoves = scrambleMoves;