(function() {
  
  function Move(face, clock) {
    this.face = face;
    this.clock = clock;
  }
  
  Move.prototype.toString = function() {
    var faceName = "BLRU"[this.face];
    if (this.clock) {
      return faceName;
    } else {
      return faceName + "'";
    }
  };
  
  function allMoves() {
    var res = [];
    for (var i = 0; i < 4; ++i) {
      res[i*2] = new Move(i, false);
      res[i*2 + 1] = new Move(i, true);
    }
    return res;
  }
  
  function movesToString(moves) {
    return moves.join(' ');
  }
  
  function parseMove(str) {
    if (str.length === 2) {
      if (str[1] !== "'") {
        throw new Error("Invalid move: " + str);
      }
      var move = parseMove(str[0]);
      move.clock = false;
      return move;
    } else if (str.length === 1) {
      var face = "BLRU".indexOf(str);
      if (face < 0) {
        throw new Error('Invalid move: ' + str);
      }
      return new Move(face, true);
    } else {
      throw new Error('Invalid move: ' + str);
    }
  }
  
  function parseMoves(str) {
    var moves = [];
    var tokens = str.split(' ');
    for (var i = 0, len = tokens.length; i < len; ++i) {
      moves[i] = parseMove(tokens[i]);
    }
    return moves;
  }
  
  if ('undefined' !== typeof window) {
    if (!window.puzzlejs) {
      window.puzzlejs = {};
    }
    if (!window.puzzlejs.skewb) {
      window.puzzlejs.skewb = {};
    }
    window.puzzlejs.skewb.Move = Move;
    window.puzzlejs.skewb.allMoves = allMoves;
    window.puzzlejs.skewb.movesToString = movesToString;
    window.puzzlejs.skewb.parseMove = parseMove;
    window.puzzlejs.skewb.parseMoves = parseMoves;
  }
  if ('undefined' !== typeof module) {
    if (!module.exports) {
      module.exports = {};
    }
    module.exports.Move = Move;
    module.exports.allMoves = allMoves;
    module.exports.movesToString = movesToString;
    module.exports.parseMove = parseMove;
    module.exports.parseMoves = parseMoves;
  }
  
})();