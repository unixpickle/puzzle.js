var pocketcube = require('../../build/pocketcube.js');
var bench = require('../../bench.js');

function benchmarkMove() {
  // Setup the cube.
  var moves = pocketcube.parseMoves("B U D B' L2 D' R' F2 L F D2 R2 F' U2 R " +
    "B2 L' U'");
  var cube = new pocketcube.Cube();
  
  var len = moves.length;
  bench('move', len, function(count) {
    for (var i = 0; i < count; ++i) {
      cube.move(moves[i % len]);
    }
  });
}

benchmarkMove();