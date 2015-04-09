var rubik = require('../../build/rubik.js');
var bench = require('../../bench.js');

function benchmarkPhase2CubeMove() {
  var moves = new rubik.Phase2Moves();
  var cube = new rubik.Phase2Cube();
  bench('Phase2Cube.move', 10, function(count) {
    for (var i = 0; i < count; ++i) {
      cube.move(i % 10, moves);
    }
  });
}

function benchmarkPhase2Moves() {
  bench('Phase2Moves', function(count) {
    while (count--) {
      new rubik.Phase2Moves();
    }
  });
}

benchmarkPhase2CubeMove();
benchmarkPhase2Moves();
