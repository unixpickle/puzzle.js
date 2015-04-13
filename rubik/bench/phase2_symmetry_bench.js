var rubik = require('../../build/rubik.js');
var bench = require('../../bench.js');

function benchmarkPhase2EdgeSym() {
  bench('Phase2EdgeSym', function(n) {
    while (n--) {
      new rubik.Phase2EdgeSym();
    }
  });
}

function benchmarkPhase2EdgeSymMove() {
  // Apply all moves to a bunch of random symmetry coordinates.
  var states = [9634, 39604, 19667, 40733, 3187, 10589, 27264, 43833, 581,
    6282, 21757, 2189, 35665, 9221, 40164, 23510, 40687, 36973, 12676, 8060,
    25099, 10331, 21511, 3993, 44060, 22141, 28300, 3368, 35519, 27598, 17737,
    11378, 24311, 30289, 37587, 13416, 25342, 39266, 43774, 32655, 15217, 4445,
    2545, 34688, 29912, 2667, 1503, 15434, 38614, 11406];
  var sym = new rubik.Phase2EdgeSym();
  bench('move', states.length*10, function(n) {
    for (var i = 0; i < n/(states.length*10); ++i) {
      for (var s = 0, len = states.length; s < len; ++s) {
        for (var m = 0; m < 10; ++m) {
          sym.move(states[s], m);
        }
      }
    }
  });
}

benchmarkPhase2EdgeSym();
benchmarkPhase2EdgeSymMove();