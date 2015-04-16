var rubik = require('../../build/rubik.js');
var bench = require('../../bench.js');

function benchmarkPhase2CubeMove() {
  var coords = new rubik.Phase2Coords();
  var cube = new rubik.Phase2Cube();
  bench('Phase2Cube.move', 10, function(count) {
    for (var i = 0; i < count; ++i) {
      cube.move(i % 10, coords);
    }
  });
}

function benchmarkPhase2Coords() {
  bench('Phase2Coords', function(count) {
    while (count--) {
      new rubik.Phase2Coords();
    }
  });
}

benchmarkPhase2CubeMove();
benchmarkPhase2Coords();
