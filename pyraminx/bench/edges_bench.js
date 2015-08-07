var pyraminx = require('../../build/pyraminx.js');
var bench = require('../../bench.js');

function benchmarkEdgesMove() {
  var moves = pyraminx.parseMoves("R L U B R' L' U' B'");
  bench('Edges.move', moves.length, function(count) {
    var len = moves.length;
    var count = Math.round(count / len);
    var edges = new pyraminx.Edges();
    while (count--) {
      for (var i = 0; i < len; ++i) {
        edges.move(moves[i]);
      }
    }
  });
}

benchmarkEdgesMove();
