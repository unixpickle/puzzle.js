var rubik = require('../../build/rubik.js');
var bench = require('../../bench.js');

function benchmarkScramble() {
  bench('scramble', function(count) {
    while (count--) {
      rubik.scrambleMoves(25);
    }
  });
}

benchmarkScramble();
