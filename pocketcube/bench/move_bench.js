var pocketcube = require('../../build/pocketcube.js');
var bench = require('../../bench.js');

function benchmarkScramble() {
  bench('scrambleMoves', function(n) {
    while (n--) {
      pocketcube.scrambleMoves(25);
    }
  });
}

benchmarkScramble();