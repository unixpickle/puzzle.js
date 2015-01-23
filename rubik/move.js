(function() {

  function Move(face, turns) {
    this.face = face;
    this.turns = turns;
  }

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

  if ('undefined' !== typeof window) {
    if (!window.puzzlejs) {
      window.puzzlejs = {};
    }
    if (!window.puzzlejs.rubik) {
      window.puzzlejs.rubik = {};
    }
    window.puzzlejs.rubik.Move = Cube;
    window.puzzlejs.rubik.parseMove = parseMove;
    window.puzzlejs.rubik.parseMoves = parseMoves;
  }
  if ('undefined' !== typeof module) {
    if (!module.exports) {
      module.exports = {};
    }
    module.exports.Move = Move;
    module.exports.parseMove = parseMove;
    module.exports.parseMoves = parseMoves;
  }

})();
